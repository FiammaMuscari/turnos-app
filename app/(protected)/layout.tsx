import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="w-full flex flex-col  items-center justify-center">
      {children}
    </div>
  );
};

export default ProtectedLayout;
