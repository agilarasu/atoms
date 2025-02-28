'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"


export function Header() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  useEffect(() => {  //Effect to add scroll style.
    const handleScroll = () => {
      const show = window.scrollY > 50;
      if (show !== isScrolled) {
        setIsScrolled(show);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const closeMenu = () => { // Close the menu when any link is clicked
    setIsMenuOpen(false)
  }

    return (
        <header className={`fixed top-0 left-0 w-full z-50  ${isScrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'} transition-colors duration-300`}>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold">
                    Atoms.
                </Link>

                {/* Mobile Menu Trigger */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild className="md:hidden">
                         <Button variant="ghost" size="icon">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </SheetTrigger>
                <SheetContent side="left">
                    <div className="flex flex-col space-y-4 mt-4">
                        <Link href="/" className="font-medium" onClick={closeMenu}>
                            Home
                        </Link>
                        <Link href="/learn" className="font-medium" onClick={closeMenu}>
                            Paths
                        </Link>
                        <Link href="/chat" className="font-medium" onClick={closeMenu}>
                            Chat
                        </Link>
                        <Link href="https://quiz-chat.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-medium" onClick={closeMenu}>
                            Try Quizzes
                        </Link>


                        {status === 'authenticated' && session?.user && (
                            <>
                                <Link href="/settings" className="font-medium" onClick={closeMenu}>
                                    Settings
                                </Link>
                                <Button variant='outline' onClick={()=>{handleLogout(); closeMenu()}}>Logout</Button>
                            </>
                        )}
                         {status === 'unauthenticated' && (
                            <Button asChild>
                                <Link href="/login" onClick={closeMenu}>Login</Link>
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>


                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/learn" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Paths
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/chat" legacyBehavior passHref>
                                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Chat
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                              <NavigationMenuItem>
                                <Link href="https://quiz-chat.vercel.app/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                       Try Quizzes
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>


                    {status === 'authenticated' && session?.user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar>
                                        <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
                                        <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {status === 'unauthenticated' && (
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}