import { PawPrint } from "@app/modules/main/interfaces/icons";
import { useState } from "react";
import { Link } from "react-router";
import IconInterface from "./iconInterface";

const LOGO_SRC = {
  horizontal: "/logo-horizontal.png",
  vertical: "/logo-vertical.png"
};

type Props = {
  variant?: "horizontal" | "vertical";
  className?: string;
};

export default function LogoInterface({ variant = "horizontal", className = "max-h-12" }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <Link to="/" className="inline-flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-buttons bg-brand text-white">
          <IconInterface icon={PawPrint} size="md" label="Abril Vet" />
        </span>
        <span className="font-display text-lg font-semibold leading-none text-ink">
          Abril <span className="text-brand-fg">Vet</span>
        </span>
      </Link>
    );
  }

  return (
    <Link to="/" className="inline-flex items-center">
      <img
        src={LOGO_SRC[variant]}
        alt="Abril Vet — Administración veterinaria"
        onError={() => setImgFailed(true)}
        className={`w-auto object-contain ${className}`}
      />
    </Link>
  );
}
