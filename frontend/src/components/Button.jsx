import { Link } from "react-router-dom";
import "../blocks/button.css";

export default function Button({ variant = "primary", to, children, ...props }) {
  const className = `btn btn-${variant}`;

  if (to) {
    return <Link to={to} className={className} {...props}>{children}</Link>;
  }
  return <button className={className} {...props}>{children}</button>;
}