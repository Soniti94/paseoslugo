#!/usr/bin/env python3
"""
Backend API Testing for Lugo Dog Walking App
Tests the high priority backend endpoints as specified in test_result.md
"""

import requests
import json
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://dogwalk-app.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.headers = HEADERS.copy()
        self.user1_token = None
        self.user2_token = None
        self.user1_id = None
        self.user2_id = None
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, token: str = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        headers = self.headers.copy()
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
            
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers)
            elif method.upper() == "POST":
                response = requests.post(url, headers=headers, json=data)
            elif method.upper() == "PATCH":
                response = requests.patch(url, headers=headers, json=data)
            else:
                return False, f"Unsupported method: {method}", 400
                
            return response.status_code < 400, response.json() if response.content else {}, response.status_code
            
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}", 0
        except json.JSONDecodeError as e:
            return False, f"JSON decode error: {str(e)}", response.status_code if 'response' in locals() else 0
    
    def test_user_registration_and_login(self):
        """Test user registration and login to get authentication tokens"""
        print("\n=== Testing User Registration and Login ===")
        
        # Test User 1 Registration
        user1_data = {
            "email": "maria.gonzalez@example.com",
            "password": "SecurePass123!",
            "name": "María González",
            "role": "owner"
        }
        
        success, response, status = self.make_request("POST", "/auth/register", user1_data)
        if success and "token" in response:
            self.user1_token = response["token"]
            self.user1_id = response["user"]["id"]
            self.log_result("User1 Registration", True, "Successfully registered user1")
        else:
            # Try login if user already exists
            login_data = {"email": user1_data["email"], "password": user1_data["password"]}
            success, response, status = self.make_request("POST", "/auth/login", login_data)
            if success and "token" in response:
                self.user1_token = response["token"]
                self.user1_id = response["user"]["id"]
                self.log_result("User1 Login", True, "Successfully logged in user1")
            else:
                self.log_result("User1 Auth", False, f"Failed to authenticate user1", response)
                return False
        
        # Test User 2 Registration (for messages testing)
        user2_data = {
            "email": "carlos.walker@example.com", 
            "password": "WalkerPass456!",
            "name": "Carlos Paseador",
            "role": "walker"
        }
        
        success, response, status = self.make_request("POST", "/auth/register", user2_data)
        if success and "token" in response:
            self.user2_token = response["token"]
            self.user2_id = response["user"]["id"]
            self.log_result("User2 Registration", True, "Successfully registered user2")
        else:
            # Try login if user already exists
            login_data = {"email": user2_data["email"], "password": user2_data["password"]}
            success, response, status = self.make_request("POST", "/auth/login", login_data)
            if success and "token" in response:
                self.user2_token = response["token"]
                self.user2_id = response["user"]["id"]
                self.log_result("User2 Login", True, "Successfully logged in user2")
            else:
                self.log_result("User2 Auth", False, f"Failed to authenticate user2", response)
                return False
        
        return True
    
    def test_profile_update(self):
        """Test PATCH /api/auth/me endpoint"""
        print("\n=== Testing Profile Update (PATCH /api/auth/me) ===")
        
        if not self.user1_token:
            self.log_result("Profile Update", False, "No authentication token available")
            return False
        
        # Test 1: Update name, phone, and address
        update_data = {
            "name": "María González Rodríguez",
            "phone": "+34 982 123 456",
            "address": "Calle Real 25, 27001 Lugo"
        }
        
        success, response, status = self.make_request("PATCH", "/auth/me", update_data, self.user1_token)
        
        if success:
            # Verify the response contains updated data
            if (response.get("name") == update_data["name"] and 
                response.get("phone") == update_data["phone"] and
                response.get("address") == update_data["address"]):
                self.log_result("Profile Update - Full", True, "Successfully updated all profile fields")
            else:
                self.log_result("Profile Update - Full", False, "Updated but response data doesn't match", response)
        else:
            self.log_result("Profile Update - Full", False, f"Failed to update profile", response)
        
        # Test 2: Partial update (only phone)
        partial_update = {"phone": "+34 982 654 321"}
        success, response, status = self.make_request("PATCH", "/auth/me", partial_update, self.user1_token)
        
        if success and response.get("phone") == partial_update["phone"]:
            self.log_result("Profile Update - Partial", True, "Successfully updated phone only")
        else:
            self.log_result("Profile Update - Partial", False, "Failed partial update", response)
        
        # Test 3: Authentication required
        success, response, status = self.make_request("PATCH", "/auth/me", update_data)
        
        if not success and status == 401:
            self.log_result("Profile Update - Auth Required", True, "Correctly requires authentication")
        else:
            self.log_result("Profile Update - Auth Required", False, "Should require authentication", response)
        
        # Test 4: Verify data persistence by getting profile
        success, response, status = self.make_request("GET", "/auth/me", token=self.user1_token)
        
        if success and response.get("phone") == "+34 982 654 321":
            self.log_result("Profile Update - Persistence", True, "Profile data persisted correctly")
        else:
            self.log_result("Profile Update - Persistence", False, "Profile data not persisted", response)
    
    def test_messages_api(self):
        """Test Messages API endpoints"""
        print("\n=== Testing Messages API ===")
        
        if not self.user1_token or not self.user2_token:
            self.log_result("Messages API", False, "Need both user tokens for messages testing")
            return False
        
        # Test 1: GET /api/messages (should be empty initially)
        success, response, status = self.make_request("GET", "/messages", token=self.user1_token)
        
        if success and isinstance(response, list):
            self.log_result("Messages - GET Empty", True, f"Successfully retrieved messages list ({len(response)} messages)")
        else:
            self.log_result("Messages - GET Empty", False, "Failed to get messages", response)
        
        # Test 2: POST /api/messages (send message from user1 to user2)
        message_data = {
            "recipient_id": self.user2_id,
            "message": "Hola Carlos, ¿podrías pasear a mi perro mañana por la tarde?",
            "booking_id": None
        }
        
        success, response, status = self.make_request("POST", "/messages", message_data, self.user1_token)
        message_id = None
        
        if success and "id" in response:
            message_id = response["id"]
            self.log_result("Messages - POST Create", True, "Successfully created message")
        else:
            self.log_result("Messages - POST Create", False, "Failed to create message", response)
        
        # Test 3: GET /api/messages with enriched data
        success, response, status = self.make_request("GET", "/messages", token=self.user1_token)
        
        if success and len(response) > 0:
            msg = response[0]
            if "sender_name" in msg and "recipient_name" in msg:
                self.log_result("Messages - GET Enriched", True, "Messages include sender/recipient names")
            else:
                self.log_result("Messages - GET Enriched", False, "Messages missing enriched user data", msg)
        else:
            self.log_result("Messages - GET Enriched", False, "No messages found after creation", response)
        
        # Test 4: GET /api/messages/unread-count
        success, response, status = self.make_request("GET", "/messages/unread-count", token=self.user2_token)
        
        if success and "count" in response and response["count"] >= 1:
            self.log_result("Messages - Unread Count", True, f"Unread count: {response['count']}")
        else:
            self.log_result("Messages - Unread Count", False, "Incorrect unread count", response)
        
        # Test 5: PATCH /api/messages/{id}/read
        if message_id:
            success, response, status = self.make_request("PATCH", f"/messages/{message_id}/read", token=self.user2_token)
            
            if success:
                self.log_result("Messages - Mark Read", True, "Successfully marked message as read")
                
                # Verify unread count decreased
                success, response, status = self.make_request("GET", "/messages/unread-count", token=self.user2_token)
                if success and response.get("count", 1) == 0:
                    self.log_result("Messages - Read Count Update", True, "Unread count updated after marking read")
                else:
                    self.log_result("Messages - Read Count Update", False, "Unread count not updated", response)
            else:
                self.log_result("Messages - Mark Read", False, "Failed to mark message as read", response)
        
        # Test 6: Authentication required for all endpoints
        success, response, status = self.make_request("GET", "/messages")
        if not success and status == 401:
            self.log_result("Messages - Auth Required", True, "Correctly requires authentication")
        else:
            self.log_result("Messages - Auth Required", False, "Should require authentication", response)
    
    def test_booking_cancellation(self):
        """Test booking cancellation with refund logic"""
        print("\n=== Testing Booking Cancellation ===")
        
        if not self.user1_token:
            self.log_result("Booking Cancellation", False, "No authentication token available")
            return False
        
        # First, create a booking to cancel
        # We need a walker and dog first
        
        # Create a dog
        dog_data = {
            "name": "Luna",
            "breed": "Golden Retriever", 
            "size": "Grande",
            "age": 3,
            "special_needs": []
        }
        
        success, dog_response, status = self.make_request("POST", "/dogs", dog_data, self.user1_token)
        if not success:
            self.log_result("Booking Cancellation - Setup", False, "Failed to create test dog", dog_response)
            return False
        
        dog_id = dog_response["id"]
        
        # Create a walker profile for user2
        walker_data = {
            "bio": "Paseador profesional con 5 años de experiencia",
            "specialties": ["Perros grandes", "Entrenamiento básico"],
            "experience_years": 5,
            "location": "Centro de Lugo",
            "price_from": 20.0
        }
        
        success, walker_response, status = self.make_request("POST", "/walkers", walker_data, self.user2_token)
        if not success:
            # Walker might already exist, get walker ID
            success, walkers_list, status = self.make_request("GET", "/walkers")
            if success and len(walkers_list) > 0:
                walker_id = walkers_list[0]["id"]
            else:
                self.log_result("Booking Cancellation - Setup", False, "Failed to create/find walker", walker_response)
                return False
        else:
            walker_id = walker_response["id"]
        
        # Create a booking for tomorrow (>2 hours ahead)
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        booking_data = {
            "walker_id": walker_id,
            "dog_id": dog_id,
            "service_type": "estandar",
            "date": tomorrow,
            "time": "10:00",
            "duration": 60,
            "amount": 22.0,
            "location": "Parque Rosalía de Castro",
            "notes": "Luna es muy amigable"
        }
        
        success, booking_response, status = self.make_request("POST", "/bookings", booking_data, self.user1_token)
        if not success:
            self.log_result("Booking Cancellation - Setup", False, "Failed to create test booking", booking_response)
            return False
        
        booking_id = booking_response["id"]
        
        # Update booking to confirmed status (simulate payment)
        # We'll need to access the database directly or use a different approach
        # For now, let's test the cancellation endpoint
        
        # Test 1: Cancel booking (should get refund since >2 hours)
        success, response, status = self.make_request("PATCH", f"/bookings/{booking_id}/cancel", token=self.user1_token)
        
        if success:
            if "refund_amount" in response and "refund_description" in response:
                refund_amount = response["refund_amount"]
                expected_refund = 22.0 - 3.0  # amount minus management fee
                
                if refund_amount == expected_refund:
                    self.log_result("Booking Cancellation - Refund Logic", True, f"Correct refund calculation: {refund_amount}€")
                else:
                    self.log_result("Booking Cancellation - Refund Logic", False, f"Incorrect refund: got {refund_amount}€, expected {expected_refund}€", response)
                
                self.log_result("Booking Cancellation - Response", True, "Cancellation response includes refund info")
            else:
                self.log_result("Booking Cancellation - Response", False, "Missing refund information in response", response)
        else:
            self.log_result("Booking Cancellation - Basic", False, "Failed to cancel booking", response)
        
        # Test 2: Try to cancel non-existent booking
        fake_booking_id = "non-existent-booking-id"
        success, response, status = self.make_request("PATCH", f"/bookings/{fake_booking_id}/cancel", token=self.user1_token)
        
        if not success and status == 404:
            self.log_result("Booking Cancellation - Not Found", True, "Correctly handles non-existent booking")
        else:
            self.log_result("Booking Cancellation - Not Found", False, "Should return 404 for non-existent booking", response)
        
        # Test 3: Authentication required
        success, response, status = self.make_request("PATCH", f"/bookings/{booking_id}/cancel")
        
        if not success and status == 401:
            self.log_result("Booking Cancellation - Auth Required", True, "Correctly requires authentication")
        else:
            self.log_result("Booking Cancellation - Auth Required", False, "Should require authentication", response)
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests for Lugo Dog Walking App")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Setup: Authentication
        if not self.test_user_registration_and_login():
            print("❌ Authentication setup failed. Cannot proceed with other tests.")
            return False
        
        # Test 1: Profile Update (HIGH PRIORITY)
        self.test_profile_update()
        
        # Test 2: Messages API (HIGH PRIORITY)  
        self.test_messages_api()
        
        # Test 3: Booking Cancellation (MEDIUM PRIORITY)
        self.test_booking_cancellation()
        
        # Summary
        self.print_summary()
        
        return True
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    tester = BackendTester()
    tester.run_all_tests()