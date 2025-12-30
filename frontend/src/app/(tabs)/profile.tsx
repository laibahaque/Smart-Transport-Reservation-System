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
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { styles } from "../../styles/profile.style";
import { COLORS } from "../../constants/colors";
import Header from "../../components/Header";
import BottomNav from "../../components/Bottom";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

/**
 * NOTE:
 * - I kept all your existing logic & fetch calls unchanged.
 * - Only updated UI elements and applied new styles from profile.style (below).
 * - If you don't use @expo/vector-icons, replace Ionicons with your icon set or remove icons.
 */

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
  const [seatCount, setSeatCount] = useState<number>(1);
  const [passport, setPassport] = useState<string>("");
  const [visaNumber, setVisaNumber] = useState<string>("");
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<number | null>(null);
  const [routeId, setRouteId] = useState<number | null>(null);

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

        const data = await res.json();
        if (res.ok && data?.name) setUserName(data.name);
      } catch (err) {
        console.log("User fetch error:", err);
      }
    };
    fetchUserData();
    fetchUserBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchTransportTypes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/vehicles`);
        const data = await response.json();
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
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.replace("/auth/login");
        }
      };

      checkAuth();
    }, [])
  );


  useEffect(() => {
    const fetchFilteredRoutes = async () => {
      if (!travelType || !selectedDate) {
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
          )}&date=${encodeURIComponent(selectedDate)}`
        );
        const json = await resp.json();

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

        const uniqueFrom = Array.from(new Set(routesArray.map((r: any) => r.from_city)));
        setFromCities(uniqueFrom);

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
          setToCities([]);
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
  }, [travelType, selectedDate, fromCity]);

  const handleFromSelect = (selectedFrom: string) => {
    setFromCity(selectedFrom);
    setToCity("");

    if (!filteredRoutes || filteredRoutes.length === 0) {
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

  // Date Picker
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirm = (date: Date) => {
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    setSelectedDate(localDate);
    hideDatePicker();
  };

  const handleConfirmBooking = async () => {
    if (!fromCity || !toCity || !selectedType || !selectedDate) {
      Alert.alert("Error", "Please select all fields before proceeding.");
      return;
    }

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
      setTypeModalVisible(false); // 👈 REQUIRED
    }

  };
  const getSelectedRouteId = () => {
    const match = filteredRoutes.find(
      (r) =>
        r.from_city.toLowerCase() === fromCity.toLowerCase() &&
        r.to_city.toLowerCase() === toCity.toLowerCase()
    );
    return match ? match.id : null;
  };
  const fetchVehiclesByRoute = async (routeId: number) => {
    console.log("Fetching vehicles for routeId:", routeId, "date:", selectedDate);

    try {
      const res = await fetch(
        `${BASE_URL}/availability/vehicles?route_id=${routeId}&date=${selectedDate}`

      );

      const json = await res.json();
      console.log("Vehicle API response:", json);

      let vehiclesArray = [];

      if (Array.isArray(json)) {
        vehiclesArray = json;
      } else if (Array.isArray(json.data)) {
        vehiclesArray = json.data;
      } else if (Array.isArray(json.vehicles)) {
        vehiclesArray = json.vehicles;
      }

      const types = Array.from(
        new Set(vehiclesArray.map((v) => v.type))
      );

      setTransportTypes(types);

      // ✅ AUTO select if only one transport
      if (types.length === 1) {
        setSelectedType(types[0]);
      }

    } catch (err) {
      console.log("Vehicle fetch error:", err);
      setTransportTypes([]);
    }
  };
  const handleRouteConfirm = async () => {
    const rId = getSelectedRouteId();
    if (!rId) {
      Alert.alert("Error", "Route not found");
      return;
    }

    setRouteId(rId);
    setSelectedType(null);
    setTransportTypes([]);
    setAvailableTimes([]);
    setHasChecked(false);

    await fetchVehiclesByRoute(rId);
    setRouteModalVisible(false);
  };

  const confirmBooking = (availabilityId: number) => {
    setSelectedAvailabilityId(availabilityId);
    setBookingModalVisible(true);
  };

  const handleBookingSubmit = async () => {
    if (!cnic) {
      Alert.alert("Error", "Please enter CNIC.");
      return;
    }
    if (!seatCount || seatCount < 1) {
      Alert.alert("Error", "Please enter valid seat count");
      return;
    }
    if (travelType === "international" && (!passport || !visaNumber)) {
      Alert.alert("Error", "Please enter Passport and Visa number.");
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
          seat_count: seatCount,
          ...(travelType === "international" && {
            passport,
            visa_number: visaNumber,

          }),
        }),


      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = {};
      }

      if (!res.ok) {
        Alert.alert("❌ Error", result.detail || "Booking failed");
        return;
      }

    } catch (err) {
      console.log("Booking error:", err);
      Alert.alert("Error", "Could not complete booking");
    }
    Alert.alert("✅ Success", "Booking confirmed!");
    setBookingModalVisible(false);
    setSelectedAvailabilityId(null);
    setCnic("");
    setSeatCount(1);
    await fetchUserBookings();
    setHasChecked(false);   // 👈 THIS IS THE KEY


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
      if (res.ok && Array.isArray(data.bookings)) {
        setUserBookings(data.bookings);
      } else {
        setUserBookings([]);
      }
    } catch (err) {
      console.log("Error fetching bookings:", err);
    }
  };

  const cancelBooking = async (bookingId) => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/booking/${bookingId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.trim()}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      Alert.alert("✅ Cancelled", "Booking cancelled successfully");
      fetchUserBookings();
    } else {
      Alert.alert(
        "❌ Error",
        data.detail || data.message || "Cancel failed"
      );
    }
  };


  const initials = userName
    ? userName
      .split(" ")
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "U";

  return (
    <View style={styles.container}>
      <Header title="Smart Transport" />

      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        {/* Modern header card with avatar */}
        <View style={styles.profileCard}>

          {/* Left side: Avatar + Name */}
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View style={{ marginLeft: 14 }}>
              <Text style={styles.greetingText}>Hello,</Text>
              <Text style={styles.userNameText}>{userName || "Traveler"}</Text>
              <Text style={styles.smallMuted}>Plan and book with ease</Text>
            </View>
          </View>

          {/* TOP-RIGHT floating button */}
          <TouchableOpacity
            style={styles.myBookingBtn}
            onPress={() => setHasChecked(false)}
          >
            <Ionicons name="time-outline" size={18} color={COLORS.primary} />
            <Text style={styles.myBookingText}>My Bookings</Text>
          </TouchableOpacity>

        </View>


        {/* Filters area */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterChip} onPress={() => setTravelTypeModalVisible(true)}>
            <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterText}>{travelType ? travelType.toUpperCase() : "TRAVEL"}</Text>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterChip} onPress={showDatePicker}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterText}>{selectedDate ?? "SELECT DATE"}</Text>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>


          <TouchableOpacity style={styles.filterChip} onPress={() => setRouteModalVisible(true)}>
            <Ionicons name="map-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterText}>ROUTE</Text>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              (!routeId || transportTypes.length === 0) && { opacity: 0.5 }
            ]}
            disabled={!routeId || transportTypes.length === 0}
            onPress={() => setTypeModalVisible(true)}
          >
            <Ionicons name="bus-outline" size={16} color={COLORS.primary} />
            <Text style={styles.filterText}>
              {selectedType ?? "TRANSPORT"}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>

        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          minimumDate={new Date()}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Travel Type Modal */}
        <Modal visible={travelTypeModalVisible} animationType="slide" transparent={true} onRequestClose={() => setTravelTypeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Travel Type</Text>
              <View style={styles.modalList}>
                {["domestic", "international"].map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.modalListItem, travelType === type && styles.modalListItemActive]}
                    onPress={() => {
                      setTravelType(type);
                      setTravelTypeModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalListText}>{type.toUpperCase()}</Text>
                    {travelType === type && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setTravelTypeModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Transport Type Modal */}
        <Modal visible={typeModalVisible} animationType="slide" transparent={true} onRequestClose={() => setTypeModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainerLarge}>
              <Text style={styles.modalTitle}>Transport Types</Text>

              {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : error ? (
                <Text style={{ color: "red", marginVertical: 10 }}>{error}</Text>
              ) : (
                <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 20 }}>
                  {transportTypes.map((type, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.modalListItem, selectedType === type && styles.modalListItemActive]}
                      onPress={() => {
                        setSelectedType(type);
                      }}
                    >
                      <Text style={styles.modalListText}>{type}</Text>
                      {selectedType === type && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmBooking}
              >
                <Text style={styles.confirmText}>Check Availability</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setTypeModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Route Modal */}
        <Modal visible={routeModalVisible} animationType="slide" transparent={true} onRequestClose={() => setRouteModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.routeModalContainer}>
              <Text style={styles.modalTitle}>Select Route</Text>

              <Text style={styles.routeDropdownLabel}>From</Text>
              <TouchableOpacity style={styles.routeDropdownBox} onPress={() => setShowFromDropdown((p) => !p)} disabled={fromCities.length === 0}>
                <Text style={styles.routeDropdownTextSmall}>
                  {fromCity ? fromCity : fromCities.length ? "Choose departure city" : "Select filters first"}
                </Text>
                <Ionicons name={showFromDropdown ? "chevron-up" : "chevron-down"} size={18} color="#666" />
              </TouchableOpacity>

              {showFromDropdown && (
                <ScrollView style={styles.routeDropdownList}>
                  {fromCities.map((city, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.routeDropdownItem, fromCity === city && styles.routeDropdownItemSelected]}
                      onPress={() => {
                        handleFromSelect(city);
                        setShowFromDropdown(false);
                      }}
                    >
                      <Text style={styles.routeDropdownTextSmall}>{city}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {fromCity !== "" && (
                <>
                  <Text style={styles.routeDropdownLabel}>To</Text>
                  <TouchableOpacity style={styles.routeDropdownBox} onPress={() => setShowToDropdown((p) => !p)} disabled={toCities.length === 0}>
                    <Text style={styles.routeDropdownTextSmall}>
                      {toCity ? toCity : toCities.length ? "Choose destination" : "No destinations"}
                    </Text>
                    <Ionicons name={showToDropdown ? "chevron-up" : "chevron-down"} size={18} color="#666" />
                  </TouchableOpacity>

                  {showToDropdown && (
                    <ScrollView style={styles.routeDropdownList}>
                      {toCities.map((city, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[styles.routeDropdownItem, toCity === city && styles.routeDropdownItemSelected]}
                          onPress={() => {
                            setToCity(city);
                            setShowToDropdown(false);
                          }}
                        >
                          <Text style={styles.routeDropdownTextSmall}>{city}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </>
              )}

              <TouchableOpacity style={styles.confirmButton} onPress={handleRouteConfirm}>
                <Text style={styles.confirmText}>Confirm Route</Text>
              </TouchableOpacity>


              <TouchableOpacity style={styles.closeButton} onPress={() => setRouteModalVisible(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Available times */}
        <View style={{ marginTop: 18 }}>
          {hasChecked && (
            <>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : availableTimes.length > 0 ? (
                <>
                  <Text style={styles.bookingTitle}>Available Times</Text>
                  <View style={{ gap: 12 }}>
                    {availableTimes.map((a, idx) => (
                      <TouchableOpacity
                        key={a.id ?? idx}
                        style={[
                          styles.bookingCard,
                          selectedAvailabilityId === a.id && styles.bookingCardSelected,
                        ]}
                        onPress={() => setSelectedAvailabilityId(a.id)}
                      >
                        <Text style={styles.bookingTimeText}>{a?.available_time ?? "No time"}</Text>
                        <Text style={styles.bookingMetaText}>{a?.vehicle_type ?? ""}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      if (!selectedAvailabilityId) {
                        Alert.alert("Error", "Please select a time first!");
                        return;
                      }
                      setBookingModalVisible(true);
                    }}
                  >
                    <Text style={styles.primaryButtonText}>Confirm Booking</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </>
          )}
        </View>

        {/* My Bookings */}
        {userBookings.length > 0 && !hasChecked && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.bookingTitle}>My Recent Bookings</Text>

            {userBookings.map((b, idx) => (
              <View key={b.booking_id ?? idx} style={styles.bookingListItem}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={styles.bookingRouteText}>
                    {b.from_city} ➜ {b.to_city}
                  </Text>
                  <Text style={styles.bookingStatusText}>{b.status}</Text>
                </View>

                <View style={{ marginTop: 6 }}>
                  <Text style={styles.smallMuted}>Date: {b.available_date}</Text>
                  <Text style={styles.smallMuted}>Time: {b.available_time}</Text>
                  <Text style={styles.smallMuted}>Vehicle: {b.vehicle_type}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    ["cancel", "cancelled"].includes(b.status.toLowerCase())
                    && {
                      backgroundColor: "#ccc"   // disabled look
                    }
                  ]}
                  disabled={["cancel", "cancelled"].includes(b.status.toLowerCase())
                  }
                  onPress={() => cancelBooking(b.booking_id)}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      ["cancel", "cancelled"].includes(b.status.toLowerCase())
                      && { color: "#666" }
                    ]}
                  >
                    {["cancel", "cancelled"].includes(b.status.toLowerCase())
                      ? "Cancelled" : "Cancel"}
                  </Text>
                </TouchableOpacity>

              </View>
            ))}
          </View>
        )}

        {/* Booking Modal */}
        <Modal visible={bookingModalVisible} animationType="slide" transparent={true} onRequestClose={() => setBookingModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Confirm Your Booking</Text>

              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Name: <Text style={{ fontWeight: "600" }}>{userName || "Loading..."}</Text>
              </Text>

              {/* CNIC – dono mein required */}
              <TextInput
                style={styles.input}
                placeholder="Enter CNIC"
                value={cnic}
                onChangeText={setCnic}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Number of Seats"
                value={seatCount.toString()}
                onChangeText={(text) => {
                  const n = parseInt(text);
                  setSeatCount(isNaN(n) ? 1 : n);
                }}

                keyboardType="numeric"
              />


              {/* Passport + Visa – sirf INTERNATIONAL */}
              {travelType === "international" && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Passport Number"
                    value={passport}
                    onChangeText={setPassport}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Enter Visa Number"
                    value={visaNumber}
                    onChangeText={setVisaNumber}
                  />
                </>
              )}

              <TouchableOpacity style={styles.confirmButton} onPress={handleBookingSubmit}>
                <Text style={styles.confirmText}>Submit Booking</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => setBookingModalVisible(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <View style={{ height: 40 }} />
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}
