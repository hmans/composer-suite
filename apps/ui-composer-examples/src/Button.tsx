import { styled } from "./styles"

export const Button = styled("button", {
  font: "inherit",
  border: "0",
  backgroundColor: "$panelText",
  color: "$panelBackground",
  padding: "0.3rem 0.75rem",
  borderRadius: "5px",
  boxShadow:
    "2px 2px 2px 0 rgba(0, 0, 0, 0.5), inset 2px 2px 10px 0 rgba(255, 255, 255, 0.8)",
  outline: "none",
  cursor: "pointer",
  width: "100%",

  transition: "background-color 0.1s ease-out",

  "&:hover": {
    backgroundColor: "#ddd"
  }
})
