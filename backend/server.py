from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Request, Header, Depends, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import base64
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Environment
JWT_SECRET = os.environ.get('JWT_SECRET')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')
BACKEND_URL = os.environ.get('BACKEND_URL', 'http://localhost:8001')
EMERGENT_AUTH_URL = os.environ.get('EMERGENT_AUTH_URL', 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "owner"  # owner or walker
    password_hash: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_token: str
    user_id: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Walker(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    bio: str
    specialties: List[str] = []
    experience_years: int = 0
    rating: float = 4.9
    reviews_count: int = 0
    availability: str = "Disponible hoy"
    location: str = "Centro de Lugo"
    price_from: float = 15.0
    is_verified: bool = True
    profile_image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Dog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_id: str
    name: str
    breed: Optional[str] = None
    size: str = "Mediano"  # Pequeño, Mediano, Grande
    age: Optional[int] = None
    special_needs: List[str] = []
    photo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    owner_id: str
    walker_id: str
    dog_id: str
    service_type: str  # basico, estandar, premium, especial
    date: str
    time: str
    duration: int  # minutes
    status: str = "pending_payment"  # pending_payment, confirmed, in_progress, completed, cancelled
    amount: float
    location: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Walk(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    route_data: List[Dict[str, float]] = []  # [{lat, lng, timestamp}]
    photos: List[str] = []  # base64 images
    report_text: Optional[str] = None
    status: str = "pending"  # pending, in_progress, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    booking_id: str
    user_id: str
    amount: float
    currency: str = "eur"
    payment_status: str = "pending"  # pending, paid, failed, expired
    status: str = "initiated"  # initiated, completed, failed
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sender_id: str
    recipient_id: str
    message: str
    booking_id: Optional[str] = None
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============ INPUT MODELS ============

class RegisterInput(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "owner"

class LoginInput(BaseModel):
    email: EmailStr
    password: str

class CreateWalkerInput(BaseModel):
    bio: str
    specialties: List[str]
    experience_years: int
    location: str
    price_from: float

class CreateDogInput(BaseModel):
    name: str
    breed: Optional[str] = None
    size: str
    age: Optional[int] = None
    special_needs: List[str] = []

class CreateBookingInput(BaseModel):
    walker_id: str
    dog_id: str
    service_type: str
    date: str
    time: str
    duration: int
    amount: float
    location: Optional[str] = None
    notes: Optional[str] = None

class UpdateWalkInput(BaseModel):
    route_point: Optional[Dict[str, float]] = None
    report_text: Optional[str] = None

class CreateCheckoutInput(BaseModel):
    booking_id: str
    origin_url: str

class CreateMessageInput(BaseModel):
    recipient_id: str
    message: str
    booking_id: Optional[str] = None

# ============ HELPER FUNCTIONS ============

async def get_current_user(authorization: Optional[str] = Header(None), cookie_session: Optional[str] = None) -> Optional[User]:
    """Get current user from session token (cookie or header)"""
    token = None
    
    # Try to get from cookie first
    if cookie_session:
        token = cookie_session
    # Then try authorization header
    elif authorization and authorization.startswith('Bearer '):
        token = authorization.replace('Bearer ', '')
    
    if not token:
        return None
    
    # Check in user_sessions
    session = await db.user_sessions.find_one({"session_token": token})
    if session:
        # Check expiration
        expires_at = session['expires_at']
        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
        if expires_at < datetime.now(timezone.utc):
            return None
        # Get user
        user_doc = await db.users.find_one({"id": session['user_id']}, {"_id": 0})
        if user_doc:
            return User(**user_doc)
    
    return None

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register")
async def register(input: RegisterInput):
    # Check if user exists
    existing = await db.users.find_one({"email": input.email})
    if existing:
        raise HTTPException(400, "Email already registered")
    
    # Create user
    user = User(
        email=input.email,
        name=input.name,
        role=input.role,
        password_hash=hash_password(input.password)
    )
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.users.insert_one(doc)
    
    # Create session
    token = create_jwt_token(user.id)
    session = UserSession(
        session_token=token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    
    session_doc = session.model_dump()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    return {"token": token, "user": user.model_dump()}

@api_router.post("/auth/login")
async def login(input: LoginInput):
    # Find user
    user_doc = await db.users.find_one({"email": input.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(401, "Invalid credentials")
    
    # Verify password
    if not verify_password(input.password, user_doc['password_hash']):
        raise HTTPException(401, "Invalid credentials")
    
    user = User(**user_doc)
    
    # Create session
    token = create_jwt_token(user.id)
    session = UserSession(
        session_token=token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    
    session_doc = session.model_dump()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    return {"token": token, "user": user.model_dump()}

@api_router.get("/auth/me")
async def get_me(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    return user.model_dump()

class UpdateProfileInput(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

@api_router.patch("/auth/me")
async def update_profile(input: UpdateProfileInput, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    # Prepare update data
    update_data = {}
    if input.name is not None:
        update_data['name'] = input.name
    if input.phone is not None:
        update_data['phone'] = input.phone
    if input.address is not None:
        update_data['address'] = input.address
    
    if update_data:
        await db.users.update_one({"id": user.id}, {"$set": update_data})
    
    # Return updated user
    user_doc = await db.users.find_one({"id": user.id}, {"_id": 0})
    return User(**user_doc).model_dump()

@api_router.post("/auth/session")
async def create_session_from_emergent(session_id: str = Header(None, alias="X-Session-ID"), response: Response = None):
    """Exchange Emergent session_id for user data and create session"""
    if not session_id:
        raise HTTPException(400, "X-Session-ID header required")
    
    # Call Emergent API
    try:
        resp = requests.get(
            EMERGENT_AUTH_URL,
            headers={"X-Session-ID": session_id}
        )
        resp.raise_for_status()
        session_data = resp.json()
    except Exception as e:
        raise HTTPException(400, f"Failed to get session data: {str(e)}")
    
    email = session_data.get('email')
    name = session_data.get('name')
    picture = session_data.get('picture')
    session_token = session_data.get('session_token')
    
    # Check if user exists
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    
    if not user_doc:
        # Create new user
        user = User(
            email=email,
            name=name,
            picture=picture,
            role="owner"
        )
        doc = user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.users.insert_one(doc)
    else:
        user = User(**user_doc)
    
    # Create session
    session = UserSession(
        session_token=session_token,
        user_id=user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    
    session_doc = session.model_dump()
    session_doc['created_at'] = session_doc['created_at'].isoformat()
    session_doc['expires_at'] = session_doc['expires_at'].isoformat()
    await db.user_sessions.insert_one(session_doc)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7*24*60*60,
        path="/"
    )
    
    return {"token": session_token, "user": user.model_dump()}

@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None), response: Response = None):
    user = await get_current_user(authorization=authorization)
    if user:
        # Delete session
        token = authorization.replace('Bearer ', '') if authorization else None
        if token:
            await db.user_sessions.delete_one({"session_token": token})
    
    # Clear cookie
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# ============ WALKERS ROUTES ============

@api_router.get("/walkers")
async def get_walkers(location: Optional[str] = None, specialty: Optional[str] = None):
    query = {}
    walkers_docs = await db.walkers.find(query, {"_id": 0}).to_list(100)
    
    # Get user data for each walker
    for walker in walkers_docs:
        user_doc = await db.users.find_one({"id": walker['user_id']}, {"_id": 0})
        if user_doc:
            walker['user_name'] = user_doc['name']
            walker['user_picture'] = user_doc.get('picture')
    
    return walkers_docs

@api_router.get("/walkers/{walker_id}")
async def get_walker(walker_id: str):
    walker_doc = await db.walkers.find_one({"id": walker_id}, {"_id": 0})
    if not walker_doc:
        raise HTTPException(404, "Walker not found")
    
    # Get user data
    user_doc = await db.users.find_one({"id": walker_doc['user_id']}, {"_id": 0})
    if user_doc:
        walker_doc['user_name'] = user_doc['name']
        walker_doc['user_email'] = user_doc['email']
        walker_doc['user_picture'] = user_doc.get('picture')
    
    return walker_doc

@api_router.post("/walkers")
async def create_walker(input: CreateWalkerInput, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    # Check if walker profile exists
    existing = await db.walkers.find_one({"user_id": user.id})
    if existing:
        raise HTTPException(400, "Walker profile already exists")
    
    walker = Walker(
        user_id=user.id,
        bio=input.bio,
        specialties=input.specialties,
        experience_years=input.experience_years,
        location=input.location,
        price_from=input.price_from
    )
    
    doc = walker.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.walkers.insert_one(doc)
    
    # Update user role
    await db.users.update_one({"id": user.id}, {"$set": {"role": "walker"}})
    
    return walker.model_dump()

# ============ DOGS ROUTES ============

@api_router.get("/dogs")
async def get_my_dogs(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    dogs = await db.dogs.find({"owner_id": user.id}, {"_id": 0}).to_list(100)
    return dogs

@api_router.post("/dogs")
async def create_dog(input: CreateDogInput, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    dog = Dog(
        owner_id=user.id,
        name=input.name,
        breed=input.breed,
        size=input.size,
        age=input.age,
        special_needs=input.special_needs
    )
    
    doc = dog.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.dogs.insert_one(doc)
    
    return dog.model_dump()

# ============ BOOKINGS ROUTES ============

@api_router.get("/bookings")
async def get_my_bookings(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    if user.role == "owner":
        bookings = await db.bookings.find({"owner_id": user.id}, {"_id": 0}).to_list(100)
    else:
        bookings = await db.bookings.find({"walker_id": user.id}, {"_id": 0}).to_list(100)
    
    # Enrich with walker/dog data
    for booking in bookings:
        walker_doc = await db.walkers.find_one({"id": booking['walker_id']}, {"_id": 0})
        if walker_doc:
            user_doc = await db.users.find_one({"id": walker_doc['user_id']}, {"_id": 0})
            booking['walker_name'] = user_doc['name'] if user_doc else "Unknown"
        
        dog_doc = await db.dogs.find_one({"id": booking['dog_id']}, {"_id": 0})
        if dog_doc:
            booking['dog_name'] = dog_doc['name']
    
    return bookings

@api_router.post("/bookings")
async def create_booking(input: CreateBookingInput, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    booking = Booking(
        owner_id=user.id,
        walker_id=input.walker_id,
        dog_id=input.dog_id,
        service_type=input.service_type,
        date=input.date,
        time=input.time,
        duration=input.duration,
        amount=input.amount,
        location=input.location,
        notes=input.notes,
        status="pending_payment"
    )
    
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.bookings.insert_one(doc)
    
    return booking.model_dump()

@api_router.get("/bookings/{booking_id}")
async def get_booking(booking_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if not booking:
        raise HTTPException(404, "Booking not found")
    
    # Check authorization
    if booking['owner_id'] != user.id:
        walker = await db.walkers.find_one({"id": booking['walker_id']})
        if not walker or walker['user_id'] != user.id:
            raise HTTPException(403, "Not authorized")
    
    return booking

@api_router.patch("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(404, "Booking not found")
    
    if booking['owner_id'] != user.id:
        raise HTTPException(403, "Not authorized")
    
    # Parse booking date and time
    from datetime import datetime, timezone, timedelta
    booking_datetime_str = f"{booking['date']} {booking['time']}"
    booking_datetime = datetime.strptime(booking_datetime_str, "%Y-%m-%d %H:%M")
    booking_datetime = booking_datetime.replace(tzinfo=timezone.utc)
    
    now = datetime.now(timezone.utc)
    time_until_booking = booking_datetime - now
    hours_until_booking = time_until_booking.total_seconds() / 3600
    
    # Determine refund amount based on cancellation policy
    amount = float(booking['amount'])
    refund_amount = 0.0
    management_fee = 3.0
    refund_description = ""
    
    if hours_until_booking > 2:
        # More than 2 hours before: refund minus management fee
        refund_amount = max(0, amount - management_fee)
        refund_description = f"Reembolso de {refund_amount}€ (total {amount}€ - {management_fee}€ gastos de gestión)"
    else:
        # Less than 2 hours before: no refund, full charge
        refund_amount = 0.0
        refund_description = f"Sin reembolso. Cancelación con menos de 2 horas de antelación. Se cobra el importe completo ({amount}€)."
    
    # Update booking status
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {
            "status": "cancelled",
            "cancelled_at": datetime.now(timezone.utc).isoformat(),
            "refund_amount": refund_amount,
            "refund_description": refund_description,
        }}
    )
    
    return {
        "message": "Booking cancelled",
        "refund_amount": refund_amount,
        "refund_description": refund_description,
        "hours_until_booking": hours_until_booking,
    }

# ============ WALKS ROUTES ============

@api_router.get("/walks/{booking_id}")
async def get_walk(booking_id: str):
    walk = await db.walks.find_one({"booking_id": booking_id}, {"_id": 0})
    if not walk:
        # Create walk if doesn't exist
        walk_obj = Walk(booking_id=booking_id)
        doc = walk_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.walks.insert_one(doc)
        return walk_obj.model_dump()
    return walk

@api_router.post("/walks/{booking_id}/start")
async def start_walk(booking_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    # Update walk
    walk = await db.walks.find_one({"booking_id": booking_id})
    if not walk:
        walk_obj = Walk(booking_id=booking_id, status="in_progress", start_time=datetime.now(timezone.utc))
        doc = walk_obj.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['start_time'] = doc['start_time'].isoformat()
        await db.walks.insert_one(doc)
    else:
        await db.walks.update_one(
            {"booking_id": booking_id},
            {"$set": {"status": "in_progress", "start_time": datetime.now(timezone.utc).isoformat()}}
        )
    
    # Update booking
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": "in_progress"}})
    
    return {"message": "Walk started"}

@api_router.post("/walks/{booking_id}/update")
async def update_walk(booking_id: str, input: UpdateWalkInput, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    update_data = {}
    if input.route_point:
        # Add route point
        await db.walks.update_one(
            {"booking_id": booking_id},
            {"$push": {"route_data": input.route_point}}
        )
    if input.report_text:
        update_data['report_text'] = input.report_text
    
    if update_data:
        await db.walks.update_one({"booking_id": booking_id}, {"$set": update_data})
    
    return {"message": "Walk updated"}

@api_router.post("/walks/{booking_id}/complete")
async def complete_walk(booking_id: str, photo: Optional[str] = None, report: Optional[str] = None, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    update_data = {
        "status": "completed",
        "end_time": datetime.now(timezone.utc).isoformat()
    }
    
    if photo:
        await db.walks.update_one(
            {"booking_id": booking_id},
            {"$push": {"photos": photo}}
        )
    
    if report:
        update_data['report_text'] = report
    
    await db.walks.update_one({"booking_id": booking_id}, {"$set": update_data})
    await db.bookings.update_one({"id": booking_id}, {"$set": {"status": "completed"}})
    
    return {"message": "Walk completed"}

@api_router.post("/walks/{booking_id}/photos")
async def add_walk_photo(booking_id: str, photo_base64: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    await db.walks.update_one(
        {"booking_id": booking_id},
        {"$push": {"photos": photo_base64}}
    )
    
    return {"message": "Photo added"}

# ============ MESSAGES ROUTES ============

@api_router.get("/messages")
async def get_messages(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    # Get messages where user is sender or recipient
    messages = await db.messages.find({
        "$or": [
            {"sender_id": user.id},
            {"recipient_id": user.id}
        ]
    }, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Enrich with user data
    for msg in messages:
        sender_doc = await db.users.find_one({"id": msg['sender_id']}, {"_id": 0})
        recipient_doc = await db.users.find_one({"id": msg['recipient_id']}, {"_id": 0})
        msg['sender_name'] = sender_doc['name'] if sender_doc else "Unknown"
        msg['recipient_name'] = recipient_doc['name'] if recipient_doc else "Unknown"
        msg['sender_picture'] = sender_doc.get('picture')
        msg['recipient_picture'] = recipient_doc.get('picture')
    
    return messages

@api_router.post("/messages")
async def send_message(input: CreateMessageInput, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    message = Message(
        sender_id=user.id,
        recipient_id=input.recipient_id,
        message=input.message,
        booking_id=input.booking_id
    )
    
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.messages.insert_one(doc)
    
    return message.model_dump()

@api_router.patch("/messages/{message_id}/read")
async def mark_message_read(message_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    await db.messages.update_one(
        {"id": message_id, "recipient_id": user.id},
        {"$set": {"read": True}}
    )
    
    return {"message": "Marked as read"}

@api_router.get("/messages/unread-count")
async def get_unread_count(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    count = await db.messages.count_documents({"recipient_id": user.id, "read": False})
    return {"count": count}

# ============ PAYMENTS ROUTES ============

PACKAGES = {
    "basico": 15.0,
    "estandar": 22.0,
    "premium": 30.0,
    "especial": 25.0
}

@api_router.post("/payments/checkout/session")
async def create_checkout_session(input: CreateCheckoutInput, authorization: Optional[str] = Header(None), request: Request = None):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    # Get booking
    booking = await db.bookings.find_one({"id": input.booking_id})
    if not booking:
        raise HTTPException(404, "Booking not found")
    
    if booking['owner_id'] != user.id:
        raise HTTPException(403, "Not authorized")
    
    # Get amount from booking
    amount = float(booking['amount'])
    
    # Create Stripe checkout
    host_url = BACKEND_URL
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    success_url = f"{input.origin_url}/pago-exitoso?session_id={{{{CHECKOUT_SESSION_ID}}}}"
    cancel_url = f"{input.origin_url}/reservar/{booking['walker_id']}"
    
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="eur",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "booking_id": input.booking_id,
            "user_id": user.id
        }
    )
    
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction
    transaction = PaymentTransaction(
        session_id=session.session_id,
        booking_id=input.booking_id,
        user_id=user.id,
        amount=amount,
        currency="eur",
        payment_status="pending",
        status="initiated",
        metadata={"booking_id": input.booking_id}
    )
    
    doc = transaction.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.payment_transactions.insert_one(doc)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/checkout/status/{session_id}")
async def get_checkout_status(session_id: str, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization=authorization)
    if not user:
        raise HTTPException(401, "Not authenticated")
    
    # Check if already processed
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    if not transaction:
        raise HTTPException(404, "Transaction not found")
    
    if transaction['payment_status'] == 'paid':
        return {"status": "complete", "payment_status": "paid", "already_processed": True}
    
    # Get status from Stripe
    webhook_url = f"{BACKEND_URL}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        checkout_status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction if paid
        if checkout_status.payment_status == 'paid' and transaction['payment_status'] != 'paid':
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"payment_status": "paid", "status": "completed"}}
            )
            
            # Update booking status
            booking_id = transaction['booking_id']
            await db.bookings.update_one(
                {"id": booking_id},
                {"$set": {"status": "confirmed"}}
            )
        
        return {
            "status": checkout_status.status,
            "payment_status": checkout_status.payment_status,
            "amount_total": checkout_status.amount_total,
            "currency": checkout_status.currency
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to get checkout status: {str(e)}")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    webhook_url = f"{BACKEND_URL}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == 'paid':
            # Update transaction
            transaction = await db.payment_transactions.find_one({"session_id": webhook_response.session_id})
            if transaction and transaction['payment_status'] != 'paid':
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {"payment_status": "paid", "status": "completed"}}
                )
                
                # Update booking
                booking_id = transaction['booking_id']
                await db.bookings.update_one(
                    {"id": booking_id},
                    {"$set": {"status": "confirmed"}}
                )
        
        return {"received": True}
    except Exception as e:
        raise HTTPException(400, f"Webhook error: {str(e)}")

# ============ UTILITY ============

@api_router.get("/config")
async def get_config():
    return {
        "google_maps_api_key": GOOGLE_MAPS_API_KEY
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()