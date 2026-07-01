import type { AuthDataType, AuthFormType } from "@app/modules/auth/entities/entities";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { InputInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  state: AuthDataType;
  onChange: (field: keyof AuthFormType, value: string) => void;
  onSubmit: () => void;
};

export default function LoginFormInterface({ state, onChange, onSubmit }: Props) {
  const { form, errors, submitting } = state;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-4"
    >
      <FieldInterface label="Email" error={errors.email} required>
        <InputInterface
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </FieldInterface>
      <FieldInterface label="Contraseña" error={errors.password} required>
        <InputInterface
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
      </FieldInterface>
      <ButtonInterface type="submit" block loading={submitting}>
        Ingresar
      </ButtonInterface>
      <ButtonInterface to="/recuperar-clave" variant="ghost" size="sm">
        ¿Olvidaste tu contraseña?
      </ButtonInterface>
    </form>
  );
}
