import { FileText, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function Contact({ data }: { data: Record<string, string> }) {
  const handleChange = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <section className="py-10">
      <div className="space-y-6 text-center">
        <div className="space-y-4">
          <h2 className="font-bold text-3xl">Let&apos;s work together.</h2>
          <p className="mx-auto max-w-2xl text-gray-300 text-base">
            I&apos;m always interested in new opportunities and exciting
            projects. Whether you have a project in mind or just want to chat
            about tech, I&apos;d love to hear from you.
          </p>
        </div>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
          <button
            className="inline-flex justify-center items-center bg-primary betterhover:hover:bg-primary/90 disabled:opacity-50 shadow px-4 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 font-medium text-primary-foreground text-sm whitespace-nowrap transition-colors cursor-target disabled:pointer-events-none"
            onClick={() => handleChange(data.EMAIL)}
          >
            <Mail className="mr-2 w-4 h-4" />
            Get in touch
          </button>
          <button
            className="inline-flex justify-center items-center hover:bg-primary/10 disabled:opacity-50 shadow px-4 border border-primary rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 font-medium text-primary text-sm whitespace-nowrap transition-colors cursor-target disabled:pointer-events-none"
            onClick={() => handleChange(data.RESUME)}
          >
            <FileText className="mr-2 w-4 h-4" />
            Download Resume
          </button>
        </div>

        <div className="flex justify-center items-center gap-6 pt-2">
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.GITHUB)}
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.LINKEDIN)}
          >
            <Linkedin className="w-5 h-5" />
          </Link>
          <Link
            href="mailto:singhalutkarsh26@gmail.com"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => handleChange(data.EMAIL)}
          >
            <Mail className="w-5 h-5" />
          </Link>
        </div>

        <div className="pt-4 cursor-target">
          <p className="text-gray-400 text-sm">
            Currently available for freelance work and full-time opportunities
          </p>
          <p className="mt-2 text-gray-500 text-xs">
            Response time: Usually within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
}
