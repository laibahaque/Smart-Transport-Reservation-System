import { StyleSheet, Dimensions, Platform } from "react-native";
import { COLORS } from "../constants/colors";

const { width, height } = Dimensions.get("window");
const scale = width / 375;

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
  },


  // WELCOME
  welcomeContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 20 * scale,
    color: COLORS.primary,
    fontWeight: "800",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14 * scale,
    color: COLORS.textLight,
    marginTop: 6,
    textAlign: "center",
  },

  // HERO
  heroSection: {
    width: width * 0.92,
    height: height * 0.28,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 12,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 12 * scale,
    fontWeight: "700",
    textAlign: "center",
  },

  // CARD
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    marginTop: 15,
    paddingVertical: 20,
    paddingHorizontal: 18,
    width: width * 0.9,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  description: {
    color: COLORS.text,
    fontSize: 12 * scale,
    lineHeight: 20,
    textAlign: "center",
  },

  // FEEDBACK
  feedbackSection: {
    marginTop: 10,
    width: width * 0.92,
    alignItems: "center",
  },
  feedbackMainTitle: {
    fontWeight: "700",
    fontSize: 15 * scale,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  feedbackBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: "100%",
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  arrowButton: { paddingHorizontal: 8 },
  feedbackContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  feedbackText: {
    color: COLORS.textLight,
    fontStyle: "italic",
    fontSize: 12 * scale,
    textAlign: "center",
    marginBottom: 5,
  },
  feedbackUser: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 11 * scale,
  },

  // CTA BUTTON
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 70,
    borderRadius: 30,
    elevation: 6,
    shadowColor: COLORS.primary,
    marginTop: 15,
  },
  bookText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16 * scale,
    textAlign: "center",
  },
});
