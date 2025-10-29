import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from "../../styles/profile.style";
import { COLORS } from "../../constants/colors";
import Header from "../../components/Header";

export default function ProfileScreen() {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [transportTypes, setTransportTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeModalVisible, setTypeModalVisible] = useState(false);

  const [routeModalVisible, setRouteModalVisible] = useState(false);
  const [fromCities, setFromCities] = useState<string[]>([]);
  const [toCities, setToCities] = useState<string[]>([]);
  const [fromCity, setFromCity] = useState<string>("");
  const [toCity, setToCity] = useState<string>("");

  const [availableTimes, setAvailableTimes] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [travelType, setTravelType] = useState<string | null>(null);
  const [travelTypeModalVisible, setTravelTypeModalVisible] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  // store full filtered route objects to compute to-cities locally
  const [filteredRoutes, setFilteredRoutes] = useState<any[]>([]);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [cnic, setCnic] = useState<string>("");
  const [passport, setPassport] = useState<string>("");
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<number | null>(null);

  const [userBookings, setUserBookings] = useState<any[]>([]);

  const BASE_URL = "http://172.16.5.234:8000/api";
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${BASE_URL}/users/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`,
          },
        });

        console.log("Fetching user with token:", token);
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);
        if (res.ok && data?.name) setUserName(data.name);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };
    fetchUserData();
    fetchUserBookings();

  }, []);

  // 🚗 Fetch Transport Types (robust handling of response shapes)
  useEffect(() => {
    const fetchTransportTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/vehicles`);
        const data = await response.json();
        // support both plain array or { data: [...] }
        const arr = Array.isArray(data) ? data : data.data ?? [];
        const uniqueTypes = Array.from(new Set(arr.map((item: any) => item.type)));
        setTransportTypes(uniqueTypes);
        setError(null);
      } catch (err: any) {
        console.log("Transport types fetch error:", err);
        setError("Unable to fetch transport types.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransportTypes();
  }, []);

  // 🚀 Fetch filtered routes when travelType + date + transport selected
  useEffect(() => {
    const fetchFilteredRoutes = async () => {
      // need all three filters to fetch meaningful routes
      if (!travelType || !selectedDate || !selectedType) {
        // clear previous filtered data if incomplete
        setFilteredRoutes([]);
        setFromCities([]);
        setToCities([]);
        setFromCity("");
        setToCity("");
        return;
      }

      setLoading(true);
      try {
        const resp = await fetch(
          `${BASE_URL}/routes/filter?travel_type=${encodeURIComponent(
            travelType
          )}&date=${encodeURIComponent(selectedDate)}&transport_type=${encodeURIComponent(
            selectedType
          )}`
        );
        const json = await resp.json();

        // Handle different backend response shapes:
        // 1) { status: "success", data: [...] }
        // 2) { from_cities: [...], to_cities: [...] }
        // 3) { routes: [...] } etc.

        let routesArray: any[] = [];

        if (json?.status === "success" && Array.isArray(json.data)) {
          routesArray = json.data;
        } else if (Array.isArray(json)) {
          routesArray = json;
        } else if (Array.isArray(json.routes)) {
          routesArray = json.routes;
        } else if (Array.isArray(json.data?.routes)) {
          routesArray = json.data.routes;
        } else if (Array.isArray(json.from_cities)) {
          // backend already provided separate lists
          setFromCities(json.from_cities);
          setToCities(json.to_cities || []);
          setFilteredRoutes([]); // nothing to compute
          setError(null);
          setLoading(false);
          return;
        } else {
          routesArray = [];
        }

        setFilteredRoutes(routesArray);

        // compute unique from cities
        const uniqueFrom = Array.from(new Set(routesArray.map((r: any) => r.from_city)));
        setFromCities(uniqueFrom);

        // if fromCity already selected and still valid, recompute toCities
        if (fromCity) {
          const relatedTo = Array.from(
            new Set(
              routesArray
                .filter((r: any) => r.from_city === fromCity)
                .map((r: any) => r.to_city)
            )
          );
          setToCities(relatedTo);
        } else {
          setToCities([]); // clear until user picks from
        }

        setError(null);
      } catch (err) {
        console.log("Error fetching filtered routes:", err);
        setError("Failed to fetch routes.");
        setFilteredRoutes([]);
        setFromCities([]);
        setToCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelType, selectedDate, selectedType]);

  // 🌐 When user picks a From city, compute To cities from filteredRoutes
  const handleFromSelect = (selectedFrom: string) => {
    setFromCity(selectedFrom);
    setToCity("");

    if (!filteredRoutes || filteredRoutes.length === 0) {
      // fallback: call existing endpoint (if you still keep cities/to/:id)
      // but preferred flow is computing from filteredRoutes
      setToCities([]);
      return;
    }

    const relatedTo = Array.from(
      new Set(
        filteredRoutes
          .filter((r: any) => r.from_city.toLowerCase() === selectedFrom.toLowerCase())
          .map((r: any) => r.to_city)
      )
    );

    setToCities(relatedTo);
  };

  // 📅 Date Picker
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date: Date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    setSelectedDate(localDate);
    hideDatePicker();
  };

  // 🔍 Check Availability
  // 🔍 Check Availability
  const handleConfirmBooking = async () => {
    if (!fromCity || !toCity || !selectedType || !selectedDate) {
      Alert.alert("Error", "Please select all fields before proceeding.");
      return;
    }

    // Close the modal immediately after clicking the button


    setLoading(true);
    setHasChecked(true);
    setError(null);
    setAvailableTimes([]);

    try {
      const res = await fetch(
        `${BASE_URL}/availability?from_city=${encodeURIComponent(fromCity)}&to_city=${encodeURIComponent(
          toCity
        )}&transport_type=${encodeURIComponent(selectedType)}&date=${encodeURIComponent(selectedDate)}`
      );
      const data = await res.json();
      console.log("Availability response:", data);

      if (Array.isArray(data) && data.length > 0) {
        const available = data.filter((a) => a.available_seat > 0);

        if (available.length > 0) {
          setAvailableTimes(available);

          setError(null);
        } else {
          setAvailableTimes([]);
          setError("Sorry, we couldn’t find a seat available for this request.");
        }
      } else {
        setAvailableTimes([]);
        setError("Sorry, we couldn’t find a seat available for this request.");
      }
    } catch (err) {
      console.log("Availability error:", err);
      Alert.alert("Error", "Failed to check availability");
    } finally {
      setLoading(false);
      setRouteModalVisible(false);
    }
  };


  // ✅ Confirm Booking
  const confirmBooking = (availabilityId: number) => {
    setSelectedAvailabilityId(availabilityId);
    setBookingModalVisible(true);
  };

  const handleBookingSubmit = async () => {
    if (!cnic || !passport) {
      Alert.alert("Error", "Please fill CNIC and Passport number.");
      return;
    }

    if (!selectedAvailabilityId) {
      Alert.alert("Error", "Please select a time first.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please login first!");
        return;
      }

      const res = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
        body: JSON.stringify({
          availability_id: selectedAvailabilityId,
          cnic,
          passport,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert("✅ Booking Confirmed", "Your seat has been booked!");
        setBookingModalVisible(false);
        setCnic("");
        setPassport("");

        await fetchUserBookings();
        setAvailableTimes([]);
        setHasChecked(false); // back to My Bookings
      } else {
        // 👇 Fix starts here
        Alert.alert("❌ Error", result.detail || "Booking failed", [
          {
            text: "OK",
            onPress: async () => {
              setBookingModalVisible(false);
              await fetchUserBookings(); // refresh user's bookings anyway
              setAvailableTimes([]);
              setHasChecked(false); // return to My Bookings
            },
          },
        ]);
      }

    } catch (err) {
      console.log("Booking error:", err);
      Alert.alert("Error", "Could not complete booking");
    }
  };


  const fetchUserBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/booking/my-bookings`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      });

      const data = await res.json();
      console.log("📋 User Bookings:", data);

      if (res.ok && Array.isArray(data.bookings)) {
        setUserBookings(data.bookings);
      } else {
        setUserBookings([]);
      }
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  };
  // ❌ Cancel Booking
  const cancelBooking = async (bookingId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      Alert.alert(
        "Cancel Booking",
        "Are you sure you want to cancel this booking?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes, Cancel",
            style: "destructive",
            onPress: async () => {
              const res = await fetch(`${BASE_URL}/booking/${bookingId}/cancel`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token.trim()}`,
                },
              });

              const data = await res.json();
              if (res.ok) {
                Alert.alert("✅ Booking Cancelled", "Your booking has been cancelled successfully.");
                await fetchUserBookings(); // refresh list
              } else {
                Alert.alert("❌ Error", data.detail || "Failed to cancel booking.");
              }
            },
          },
        ]
      );
    } catch (err) {
      console.log("Cancel booking error:", err);
      Alert.alert("Error", "Something went wrong while cancelling booking.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Smart Transport" />
      <ScrollView contentContainerStyle={styles.screenContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Smart Travel Begins Here!</Text>
          <Text
            style={[
              styles.boxText,
              { textDecorationLine: "underline", fontSize: 16, color: COLORS.primary },
            ]}
          >
            Carefree Booking
          </Text>
        </View>

        {/* 🔝 Step 1: Travel Type + Date */}
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => setTravelTypeModalVisible(true)}
          >
            <Text style={styles.boxText}>
              {travelType ? travelType : "Select Travel Type"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={showDatePicker}>
            <Text style={styles.boxText}>
              {selectedDate ? selectedDate : "Select Date"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🔻 Step 2: Transport + Route */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.box} onPress={() => setTypeModalVisible(true)}>
            <Text style={styles.boxText}>
              {selectedType ? selectedType : "Select Transport"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box} onPress={() => setRouteModalVisible(true)}>
            <Text style={styles.boxText}>Select Route</Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* 🌍 Travel Type Modal */}
        <Modal
          visible={travelTypeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setTravelTypeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Travel Type</Text>
              {["domestic", "international"].map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setTravelType(type);
                    setTravelTypeModalVisible(false);
                  }}
                >
                  <Text style={{ fontSize: 16, textTransform: "capitalize" }}>{type}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setTravelTypeModalVisible(false)}
              >
                <Text style={{ color: "red" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 🚗 Transport Type Modal */}
        <Modal
          visible={typeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setTypeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Transport Type</Text>

              {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : error ? (
                <Text style={{ color: "red", marginVertical: 10 }}>{error}</Text>
              ) : (
                <ScrollView>
                  {transportTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedType(type);
                        setTypeModalVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setTypeModalVisible(false)}
              >
                <Text style={{ color: "red" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 🧭 Route Modal */}
        <Modal
          visible={routeModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setRouteModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.routeModalContainer}>
              <Text style={styles.modalTitle}>Select Route</Text>

              {/* FROM CITY */}
              <Text style={styles.routeDropdownLabel}>From City</Text>
              <TouchableOpacity
                style={styles.routeDropdownBox}
                onPress={() => setShowFromDropdown((prev) => !prev)}
                disabled={fromCities.length === 0}
              >
                <Text style={styles.routeDropdownText}>
                  {fromCity ? fromCity : fromCities.length ? "Select From City" : "Select filters first"}
                </Text>
                <Text style={{ fontSize: 18, color: "#777" }}>{showFromDropdown ? "▲" : "▼"}</Text>
              </TouchableOpacity>

              {showFromDropdown && (
                <ScrollView style={styles.routeDropdownList}>
                  {fromCities.map((city, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.routeDropdownItem,
                        fromCity === city && styles.routeDropdownItemSelected,
                        idx === fromCities.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      onPress={() => {
                        handleFromSelect(city);
                        setShowFromDropdown(false);
                      }}
                    >
                      <Text style={styles.routeDropdownText}>{city}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* TO CITY */}
              {fromCity !== "" && (
                <>
                  <Text style={styles.routeDropdownLabel}>To City</Text>
                  <TouchableOpacity
                    style={styles.routeDropdownBox}
                    onPress={() => setShowToDropdown((prev) => !prev)}
                    disabled={toCities.length === 0}
                  >
                    <Text style={styles.routeDropdownText}>
                      {toCity ? toCity : toCities.length ? "Select To City" : "No destinations"}
                    </Text>
                    <Text style={{ fontSize: 18, color: "#777" }}>{showToDropdown ? "▲" : "▼"}</Text>
                  </TouchableOpacity>

                  {showToDropdown && (
                    <ScrollView style={styles.routeDropdownList}>
                      {toCities.map((city, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.routeDropdownItem,
                            toCity === city && styles.routeDropdownItemSelected,
                            idx === toCities.length - 1 && { borderBottomWidth: 0 },
                          ]}
                          onPress={() => {
                            setToCity(city);
                            setShowToDropdown(false);
                          }}
                        >
                          <Text style={styles.routeDropdownText}>{city}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </>
              )}

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                <Text style={styles.confirmText}>Check Availability</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setRouteModalVisible(false)}
              >
                <Text style={{ color: "red" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 🕓 Available Times or Seat Unavailable Message */}
        {/* 🕓 Available Times or Seat Unavailable Message */}
        <View style={{ marginTop: 20 }}>
          {hasChecked && (
            <>
              {error ? (
                <Text
                  style={{
                    textAlign: "center",
                    color: "red",
                    fontSize: 16,
                    marginVertical: 20,
                  }}
                >
                  {error}
                </Text>
              ) : availableTimes.length > 0 ? (
                <>
                  <Text style={styles.bookingTitle}>Available Times</Text>

                  {/* Showing available time slots */}
                  {availableTimes.map((a, idx) => (
                    <TouchableOpacity
                      key={a.id ?? idx}
                      style={[
                        styles.bookingCard,
                        selectedAvailabilityId === a.id && {
                          borderColor: COLORS.primary,
                          borderWidth: 2,
                        },
                      ]}
                      onPress={() => setSelectedAvailabilityId(a.id)}
                    >
                      <Text style={{ color: COLORS.text, fontSize: 16 }}>
                        {a?.available_time ?? "No time"}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Confirm Booking button (outside modal) */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: COLORS.primary,
                      paddingVertical: 14,
                      borderRadius: 12,
                      marginTop: 25,
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (!selectedAvailabilityId) {
                        Alert.alert("Error", "Please select a time first!");
                        return;
                      }
                      setBookingModalVisible(true);
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      Confirm Booking
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </>
          )}
        </View>
        {/* 🧾 My Bookings Section */}
        {userBookings.length > 0 && !hasChecked && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.bookingTitle}>My Recent Bookings</Text>

            {userBookings.map((b, idx) => (
              <View
                key={b.booking_id ?? idx}
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  borderRadius: 10,
                  marginVertical: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {b.from_city} ➜ {b.to_city}
                </Text>
                <Text>Date: {b.available_date}</Text>
                <Text>Time: {b.available_time}</Text>
                <Text>Vehicle: {b.vehicle_type}</Text>
                <Text>Status: {b.status}</Text>

                {/* 👇 Add Cancel Button here */}
                {b.status.toLowerCase() !== "cancel" && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      paddingVertical: 8,
                      borderRadius: 8,
                      marginTop: 10,
                      alignItems: "center",
                    }}
                    onPress={() => cancelBooking(b.booking_id)}
                  >
                    <Text style={{ color: "white", fontWeight: "600" }}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}

          </View>
        )}

        {/* 🧾 Booking Modal */}
        <Modal
          visible={bookingModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setBookingModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Your Booking</Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Name:{" "}
                <Text style={{ fontWeight: "600" }}>
                  {userName || "Loading..."}
                </Text>
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter CNIC"
                value={cnic}
                onChangeText={setCnic}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter Passport Number"
                value={passport}
                onChangeText={setPassport}
              />

              {/* Submit Booking button */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleBookingSubmit}
              >
                <Text style={styles.confirmText}>Submit Booking</Text>
              </TouchableOpacity>


              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setBookingModalVisible(false)}
              >
                <Text style={{ color: "red" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


      </ScrollView >
    </View >
  );
}
