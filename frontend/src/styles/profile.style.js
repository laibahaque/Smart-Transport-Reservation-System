import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // keep your theme
  },
  screenContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  // Profile top card
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft ?? "#e6f2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  greetingText: {
    fontSize: 14,
    color: "#777",
  },
  userNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  smallMuted: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 2,
  },

  quickAction: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "transparent",
    flexDirection: "row",
    gap: 6,
  },
  quickActionText: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Filters (chips)
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  filterChip: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  filterText: {
    flex: 1,
    marginLeft: 8,
    fontWeight: "700",
    color: COLORS.text,
    fontSize: 13,
  },

  // Modal shared
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  modalContainer: {
    width: "92%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  modalContainerLarge: {
    width: "94%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    maxHeight: "75%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
  },
  modalList: {
    width: "100%",
  },
  modalListItem: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalListItemActive: {
    backgroundColor: "#f1fbff",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalListText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    marginTop: 12,
  },
  closeText: {
    color: "#ff5a5a",
    fontWeight: "700",
  },

  // Inputs
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: "#fafafa",
  },

  // Confirm button
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  // Route dropdown styles (modern)
  routeDropdownLabel: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: 13,
    color: COLORS.text,
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  routeDropdownBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },

  routeDropdownText: {
    fontSize: 16,
    color: "#333",
  },

  routeDropdownTextSmall: {
    fontSize: 14,
    color: "#333",
  },

  routeDropdownList: {
    maxHeight: 160,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 6,
    width: "100%",
    elevation: 4,
  },

  routeDropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  routeDropdownItemSelected: {
    backgroundColor: "#eef9ff",
  },

  routeModalContainer: {
    width: "94%",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  // Booking list / cards
  bookingTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 10,
  },
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    alignItems: "flex-start",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
  bookingTimeText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  bookingMetaText: {
    fontSize: 13,
    color: "#777",
    marginTop: 6,
  },

  // primary button used below available times
  primaryButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 15,
    marginVertical: 12,
  },

  // My bookings list item
  myBookingBtn: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F3EFFE",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 20,
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  position: "absolute",
  right: 7,
  top: 8,
},

myBookingText: {
  marginLeft: 4,
  color: COLORS.primary,
  fontWeight: "600",
  fontSize: 12,
},

  bookingListItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginVertical: 9,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingRouteText: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
  },
  bookingStatusText: {
    fontWeight: "700",
    color: COLORS.primary,
  },

  cancelButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#ff6060",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  
});
