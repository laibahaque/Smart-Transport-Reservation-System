import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "flex-start",   // top alignment
    alignItems: "center",

  },

  centerLogo: {
    width: "60%",     // perfect size
    height: undefined,
    aspectRatio: 1,
    alignSelf: "center",
    // marginTop: 20,    // thoda sa upar
    // marginBottom: 15,
    resizeMode: "contain",
  },


  authTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginBottom: 6,
    textAlign: "center",
  },

  authSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 20,
    textAlign: "center",
  },

  formCard: {
    width: "100%",
    backgroundColor: COLORS.white,
    padding: 18,
    borderRadius: 18,
    elevation: 4,
    // marginTop: 10,
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 13,
    fontSize: 16,
    marginBottom: 10,
    color: COLORS.text,
  },

  inputFocused: {
    borderColor: COLORS.primary,
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 14,
  },

  button: {
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "600",
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#ffecec",
    marginBottom: 12,
    gap: 6,
  },

  errorText: {
    color: COLORS.primary,
    fontSize: 13,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  footerText: {
    color: COLORS.textLight,
    fontSize: 14,
  },

  footerLink: {
    marginLeft: 6,
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
});
