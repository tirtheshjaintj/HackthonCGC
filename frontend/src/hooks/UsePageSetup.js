import { useEffect } from "react";

const usePageSetup = (title) => {
    useEffect(() => {
        document.title = `CivicTrack: ${title}`;
        window.scrollTo(0, 0);
    }, [title]);
};

export default usePageSetup;
