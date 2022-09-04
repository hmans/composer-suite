import { styled } from "./styles"

export const Input = styled("input", {
  font: "inherit",
  color: "inherit",
  backgroundColor: "inherit",
  border: "0",
  background: "#222",
  padding: "5px 8px",
  outline: "none",
  caretColor: "hotpink",
  borderRadius: "5px",
  boxShadow:
    "inset 1px 1px 2px 0 rgba(0, 0, 0, 0.5), inset -1px -1px 2px 0 rgba(255, 255, 255, 0.2)",
  "&::selection": {
    backgroundColor: "hotpink",
    color: "white"
  },
  width: "100%"
})
