import type {
  PatientFormType,
  PatientsDataType,
  ReproductiveStatusType,
  SexType,
  SpeciesType
} from "@app/modules/patients/entities/entities";

// Etiquetas en español para la UI (sin enum: mapas tipados).
export const SPECIES_LABELS: Record<SpeciesType, string> = {
  dog: "Perro",
  cat: "Gato",
  bird: "Ave",
  rabbit: "Conejo",
  reptile: "Reptil",
  rodent: "Roedor",
  other: "Otro"
};

export const SEX_LABELS: Record<SexType, string> = {
  male: "Macho",
  female: "Hembra",
  unknown: "Sin especificar"
};

export const REPRODUCTIVE_LABELS: Record<ReproductiveStatusType, string> = {
  intact: "Entero",
  neutered: "Castrado",
  spayed: "Esterilizada",
  unknown: "Sin especificar"
};

// Formulario vacío (alta de paciente).
export const EMPTY_FORM: PatientFormType = {
  clientId: "",
  name: "",
  species: "dog",
  breed: "",
  sex: "unknown",
  birthDate: "",
  color: "",
  weightKg: "",
  microchip: "",
  identificationNumber: "",
  reproductiveStatus: "unknown",
  allergies: "",
  preexistingConditions: "",
  habitualMedication: "",
  notes: "",
  photoUrl: ""
};

export const INITIAL_STATE = {
  PATIENTS_PAGE: {
    items: [],
    loading: true,
    query: "",
    speciesFilter: "all",
    mode: "list",
    selected: null,
    form: EMPTY_FORM,
    errors: {},
    saving: false
  } satisfies PatientsDataType
};
