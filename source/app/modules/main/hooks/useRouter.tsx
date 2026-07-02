import { useLocation, useNavigate, useParams } from "react-router";

// Hook compartido para acceder a params, navegación y ubicación.
// Nunca uses useParams() directo en los módulos: usá este hook.
export const useRouter = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return {
    href: window.location.href,
    pathname: location.pathname,
    search: decodeURIComponent(location.search),
    searchParams: new URLSearchParams(location.search),
    key: location.key,
    state: location.state,
    params: params,
    navigate: navigate
  };
};
