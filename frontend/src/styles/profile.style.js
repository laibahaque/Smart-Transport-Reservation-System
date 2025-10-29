import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  screenContent: {
    marginTop: 8,
    padding: 8,
  },

  // 🔹 Header
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 5,
  },

  // 🔹 Two-row Layout
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  box: {
    flex: 1,
    backgroundColor: COLORS.card,
    paddingVertical: 25,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  boxText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },

  // 🔹 Route Box (for modal open)
  routeBox: {
    backgroundColor: COLORS.card,
    paddingVertical: 25,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  routeText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },

  // 🔹 Dropdown
  dropdownItem: {
    padding: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    width: "100%",
  },

  // 🔹 Booking Section
  bookingSection: {
    flex: 1,
    marginBottom: 30,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  bookingText: {
    color: COLORS.textSecondary,
  },

  // 🔹 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 15,
  },

  // 🧭 Input Fields
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    fontSize: 15,
    color: COLORS.text,
  },

  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
  },
  // 🔹 Route Dropdown Styles
routeDropdownLabel: {
  marginTop: 10,
  fontWeight: "600",
  fontSize: 16,
  color: COLORS.text,
  alignSelf: "flex-start",
},

routeDropdownBox: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  borderWidth: 1,
  borderColor: "#bbb",
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 15,
  marginTop: 6,
  width: "100%",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},

routeDropdownText: {
  fontSize: 16,
  color: "#333",
},

routeDropdownList: {
  maxHeight: 160,
  backgroundColor: COLORS.white,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  marginTop: 5,
  paddingVertical: 5,
  width: "100%",
  elevation: 3,
},

routeDropdownItem: {
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},

routeDropdownItemSelected: {
  backgroundColor: "#e6f2ff",
},

routeModalContainer: {
  width: "90%",
  backgroundColor: COLORS.white,
  borderRadius: 15,
  paddingVertical: 25,
  paddingHorizontal: 20,
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 4,
  elevation: 5,
},

});
