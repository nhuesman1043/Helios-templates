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


// ========================
// React
// ========================


// ========================
// Mantine
// ========================
// Core
import { 
  Container, 
  Group, 
  Tooltip, 
  Title,
} from "@mantine/core"

// ========================
// Tabler Icons
// ========================
import { IconPlaceholder } from "@tabler/icons-react"

// ========================================
// HEADER
// ========================================

export default function Header() {
  // ========================
  // Operations
  // ========================
  // 

  // ========================
  // Render
  // ========================
  return (
    <div id="header" className="relative">
      <Container fluid>
        <Group h="100%">
          <Tooltip 
            label="My GitHub" 
            withArrow
            arrowSize={8}
            color="gray"
          >
            <a
              href="https://github.com/nhuesman1043?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="My GitHub"
            >
              <IconPlaceholder size={45} className="cursor-pointer text-text-primary" />
            </a>
          </Tooltip>
          <Title order={2}>
            project name here
          </Title>
        </Group>
      </Container>
    </div>
  )
}
