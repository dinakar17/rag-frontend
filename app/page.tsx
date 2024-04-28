"use client"
import { BackgroundColorBlur, BackgroundGridPattern, PageLayout } from "@/components/Layouts";
import { DocumentQA } from "@/components/query/DocumentQA";
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeProvider } from "next-themes";



export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <PageLayout>
      <div className="   flex flex-col items-center  gap-3 px-3">
        <div className="mb-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            
              <div className=" flex w-full flex-col items-center ">
                <DocumentQA namespace={""} />
              </div>
          </AnimatePresence>

          <div className="absolute inset-0 -z-10 overflow-hidden ">
            <BackgroundGridPattern />
          </div>
          <BackgroundColorBlur />
        </div>
      </div>
    </PageLayout>
    </ThemeProvider>
  );
}
