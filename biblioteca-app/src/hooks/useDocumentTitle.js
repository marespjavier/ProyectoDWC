import { useEffect } from "react";

/*
|--------------------------------------------------------------------------
| Hook título página
|--------------------------------------------------------------------------
*/

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}