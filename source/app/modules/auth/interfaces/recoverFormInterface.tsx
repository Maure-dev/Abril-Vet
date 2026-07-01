import type { AuthDataType, AuthFormType } from "@app/modules/auth/entities/entities";
import ButtonInterface from "@app/modules/main/interfaces/buttonInterface";
import FieldInterface from "@app/modules/main/interfaces/fieldInterface";
import { InputInterface } from "@app/modules/main/interfaces/inputInterface";

type Props = {
  state: AuthDataType;
  onChange: (field: keyof AuthFormType, value: string) => void;
  onSubmit: () => void;
};

export default function RecoverFormInterface({ state, onChange, onSubmit }: Props) {
  const { form, errors, submitting, recoverySent } = state;

  if (recoverySent) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-ink-soft">
          Si el email está registrado, vas a recibir un mensaje con las instrucciones para
          restablecer tu contraseña.
        </p>
        <ButtonInterface to="/ingresar" variant="secondary" block>
          Volver a ingresar
        </ButtonInterface>
      </div>
    );
  }

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
      <ButtonInterface type="submit" block loading={submitting}>
        Enviar email de recuperación
      </ButtonInterface>
      <ButtonInterface to="/ingresar" variant="ghost" size="sm">
        Volver a ingresar
      </ButtonInterface>
    </form>
  );
}
