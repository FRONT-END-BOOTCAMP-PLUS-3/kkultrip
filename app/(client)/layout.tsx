import "../globals.css";

import Header from "@/components/header/Header";

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="container">
      <Header />
      {children}
    </div>
  );
};

export default ClientLayout;
