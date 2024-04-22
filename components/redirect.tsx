import { useEffect } from "react";
import { useRouter } from "next/router";
import languageDetector from "@/lib/languageDetector";
import type { FC } from "react";

export const useRedirect = (to?: string) => {
    const router = useRouter();
    to = to ?? router.asPath;

    // language detection
    useEffect(() => {
        const detectedLng = languageDetector.detect();

        if (detectedLng) {
            if (to.startsWith("/" + detectedLng) && router.route === "/404") {
                // prevent endless loop
                router.replace("/" + detectedLng + router.route).catch(console.error);
                return;
            }

            if (languageDetector.cache) {
                languageDetector.cache(detectedLng);
            }
            router.replace("/" + detectedLng + to).catch(console.error);
        }
    }, [to, router]);

    return <></>;
};

export const Redirect: FC = () => {
    useRedirect();
    return <></>;
};

export const getRedirect =
    (to?: string): FC =>
    // eslint-disable-next-line react/display-name
    () => {
        useRedirect(to);
        return <></>;
    };
