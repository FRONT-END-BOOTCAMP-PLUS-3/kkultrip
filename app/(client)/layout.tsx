import "../globals.css";

import Header from "@/components/header/Header";

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isLoggedIn = true;
  return (
    <div className="container">
      <Header isLoggedIn={isLoggedIn} />
      {children}
    </div>
  );
};

export default ClientLayout;
