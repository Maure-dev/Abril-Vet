import type { CertificateDataType } from "@app/modules/main/helpers/printCertificate";
import { printCertificate } from "@app/modules/main/helpers/printCertificate";
import ButtonInterface from "./buttonInterface";
import IconInterface from "./iconInterface";
import { Printer } from "./icons";

type Props = {
  label: string;
  data: CertificateDataType;
};

// Botón reutilizable que genera e imprime un certificado (vacunación, desparasitación, buena salud).
export default function CertificateButtonInterface({ label, data }: Props) {
  return (
    <ButtonInterface variant="secondary" size="sm" onClick={() => printCertificate(data)}>
      <IconInterface icon={Printer} size="sm" />
      {label}
    </ButtonInterface>
  );
}
