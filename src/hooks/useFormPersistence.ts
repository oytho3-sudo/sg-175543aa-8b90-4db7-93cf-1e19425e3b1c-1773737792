import { useEffect, useRef } from "react";

/**
 * Hook für automatische Formular-Persistierung mit localStorage
 * Speichert und lädt Formulardaten automatisch für die aktuelle Seite
 */
export function useFormPersistence(pageKey: string) {
  const formRef = useRef<HTMLFormElement>(null);
  const storageKey = `form_data_${pageKey}`;

  // Daten beim Laden wiederherstellen
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (!savedData || !formRef.current) return;

    try {
      const data = JSON.parse(savedData);
      const form = formRef.current;

      Object.keys(data).forEach((name) => {
        const element = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (element) {
          if (element.type === "checkbox") {
            (element as HTMLInputElement).checked = data[name];
          } else if (element.type === "radio") {
            const radio = form.querySelector(`input[name="${name}"][value="${data[name]}"]`) as HTMLInputElement;
            if (radio) radio.checked = true;
          } else {
            element.value = data[name];
          }
        }
      });
    } catch (error) {
      console.error("Fehler beim Laden der gespeicherten Daten:", error);
    }
  }, [storageKey]);

  // Daten bei jeder Änderung speichern
  const saveFormData = () => {
    if (!formRef.current) return;

    const form = formRef.current;
    const formData: Record<string, any> = {};

    Array.from(form.elements).forEach((element) => {
      const input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (input.name) {
        if (input.type === "checkbox") {
          formData[input.name] = (input as HTMLInputElement).checked;
        } else if (input.type === "radio") {
          if ((input as HTMLInputElement).checked) {
            formData[input.name] = input.value;
          }
        } else {
          formData[input.name] = input.value;
        }
      }
    });

    localStorage.setItem(storageKey, JSON.stringify(formData));
  };

  // Event-Listener für automatisches Speichern
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    form.addEventListener("input", saveFormData);
    form.addEventListener("change", saveFormData);

    return () => {
      form.removeEventListener("input", saveFormData);
      form.removeEventListener("change", saveFormData);
    };
  }, [storageKey]);

  // Funktion zum manuellen Löschen der gespeicherten Daten
  const clearSavedData = () => {
    localStorage.removeItem(storageKey);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return { formRef, clearSavedData };
}