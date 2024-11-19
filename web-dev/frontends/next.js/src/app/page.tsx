// ========================================
// DIRECTIVES
// ========================================

"use client"

// ========================================
// IMPORTS
// ========================================

// ========================
// Components
// ========================
import Header from "@/components/header/header"
import Navbar from "@/components/navbar/navbar"
import Content from "@/components/content/content"

// ========================
// Mantine
// ========================
// Core
import { 
  AppShell, 
  Burger, 
  Group,
  ScrollArea,
} from "@mantine/core"

// Hooks
import { 
  useDisclosure,
} from "@mantine/hooks"

// ========================================
// HOME
// ========================================

export default function Home() {
  // ========================
  // Operations
  // ========================
  // Navabr toggle
  const [opened, { toggle }] = useDisclosure()

  // 

  // ========================
  // Render
  // ========================
  return (
    <main>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
        className="text-text-primary"
        styles={{
          header: {
            backgroundColor: "var(--background-primary)",
            borderColor: "var(--border-primary)",
          },
          navbar: {
            backgroundColor: "var(--background-primary)",
            borderColor: "var(--border-primary)",
          },
          main: {
            backgroundColor: "var(--background-primary)",
            borderColor: "var(--border-primary)",
          }
        }}
      >
        {/* Header */}
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Toggle navigation menu"
            />
            <Header />
          </Group>
        </AppShell.Header>

        {/* Navbar */}
        <AppShell.Navbar p="md">
          <AppShell.Section grow component={ScrollArea}>
            <Navbar />
          </AppShell.Section>
        </AppShell.Navbar>

        {/* Main */}
        <AppShell.Main>
          <Content />
        </AppShell.Main>
      </AppShell>
    </main>
  )
}
