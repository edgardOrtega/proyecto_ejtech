import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Error404 = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirigir al home después de 5 segundos
    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Página no encontrada</h1>
      <p>Lo sentimos. La página que buscas no existe.</p>
      <p>Serás redirigido al inicio en <strong>{countdown}</strong> segundos.</p>
    </div>
  );
};

export default Error404;
