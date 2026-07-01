import { useEffect } from "react";

type DocumentMeta = {
  title: string;
  description?: string;
};

const BASE_TITLE = "Abril Vet";

function upsertMeta(name: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Setea title/description por ruta. Cada Module aporta su título/descripción específicos.
export const useDocumentHead = (meta: DocumentMeta): void => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = meta.title ? `${meta.title} · ${BASE_TITLE}` : BASE_TITLE;

    if (meta.description) {
      upsertMeta("description", meta.description);
    }

    return () => {
      document.title = previousTitle;
    };
  }, [meta.title, meta.description]);
};
