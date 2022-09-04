import { styled } from "./styles"

export const Button = styled("button", {
  width: "100%",
  padding: "4px 8px 3px 8px",
  borderRadius: "5px",
  boxShadow:
    "2px 2px 2px 0 rgba(0, 0, 0, 0.5), inset 2px 2px 2px 0 rgba(255, 255, 255, 0.2)",
  border: "1px solid rgba(0, 0, 0, 0.8)",
  borderWidth: "1px 1px 3px 1px",
  outline: "none",

  font: "inherit",
  backgroundColor: "#555",
  color: "rgba(255, 255, 255, 0.7)",
  cursor: "pointer",
  textShadow: "rgba(0, 0, 0, 0.2) 1px 2px 1px",

  // transition: "background-color 0.1s ease-out",

  "&:hover": {
    backgroundColor: "#666"
  },

  "&:active": {
    borderWidth: "2px 0 2px 2px"
  }
})
