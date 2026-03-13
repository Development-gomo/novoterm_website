import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Custom404() {
  const { asPath } = useRouter();
  const isEN = asPath.startsWith('/en');

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center px-4 relative"
        style={{
          backgroundImage: "url('/404-img.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <div className="absolute inset-0 bg-black/50" /> */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* 404 Number */}
          <h1 className="font-montserrat text-9xl font-bold text-white mb-4">
            404
          </h1>
                    
          <p className="font-montserrat text-lg text-white mb-8 max-w-md mx-auto">
            {isEN
              ? "Sorry, the content you were looking for is not available."
              : "Tyvärr, innehållet du försökte finna är inte tillgängligt."}
          </p>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={isEN ? "/en" : "/"}>
              <button className="btn-primary lg:mt-[6px] w-fit">
                {isEN ? "Back to homepage" : "Tillbaka till startsidan"}
              </button>
            </Link>
            
            <Link href={isEN ? "/en/contact-us" : "/kontakta-oss"}>
              <button className="btn-primary lg:mt-[6px] w-fit">
                {isEN ? "Contact us" : "Kontakta oss"}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
