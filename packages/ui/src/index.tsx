import React from "react"

export const Card: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: 8, marginBottom: "1rem" }}>
    <h3>{title}</h3>
    <div>{children}</div>
  </div>
)

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button style={{ padding: "0.4rem 0.8rem", borderRadius: 4, cursor: "pointer" }} {...props} />
)
