function UIRoot({ children }: { children?: React.ReactNode }) {
  return <div>{children}</div>
}

function App() {
  return <UIRoot>Yooo</UIRoot>
}

export default App
