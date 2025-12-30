import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "../constants/colors";

const { width, height } = Dimensions.get("window");

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // HERO
  heroSection: {
    width: width,
    height: height * 0.27,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  heroOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  heroTitle: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 4,
  },

  // SECTIONS
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },

  // CATEGORIES
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  categoryBox: {
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 12,
    width: 80,
    elevation: 4,
  },
  categoryText: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.text,
  },


  // ROUTES
  routeCard: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 14,
    marginHorizontal: 10,
    marginTop: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  routeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },

  // BOOK BUTTON
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    marginHorizontal: 35,
    borderRadius: 30,
    marginTop: 30,
    elevation: 5,
  },
  bookText: {
    color: COLORS.white,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },

  // BOTTOM NAV
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    backgroundColor: COLORS.card,
    elevation: 10,
    paddingVertical: 12,
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 11,
    marginTop: 2,
  },
  navText: {
    color: COLORS.textLight,
    fontSize: 11,
    marginTop: 2,
  },
});