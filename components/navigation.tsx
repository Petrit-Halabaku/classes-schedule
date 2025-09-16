"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Settings,
  Home,
  BarChart3,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/components/auth/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    await signOut();
    router.replace("/schedules");
  };

  const navItems = [
    {
      href: "/",
      label: "Schedule View",
      icon: Calendar,
    },
    ...(user
      ? [
          {
            href: "/manage",
            label: "Manage",
            icon: Settings,
          },
          {
            href: "/dashboard",
            label: "Dashboard",
            icon: BarChart3,
          },
        ]
      : []),
  ];

  const NavItems = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant={pathname === item.href ? "default" : "ghost"}
            size="sm"
            asChild
            onClick={() => setIsOpen(false)}
          >
            <Link href={item.href} className="flex items-center space-x-2">
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </>
  );

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6" />
              <span className="font-bold text-lg">Class Schedule</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItems />
            {user && (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 rounded-full"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-10 w-56 bg-white border shadow-lg rounded-md z-[100]">
                    <div className="p-1">
                      <div
                        className="px-2 py-1.5 text-sm hover:bg-gray-100 rounded cursor-pointer flex items-center"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavItems />
                  {user && (
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
