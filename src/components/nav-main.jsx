import * as React from "react"
import { ChevronRight } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

export function NavMain({
  items,
  onItemClick
}) {
  return (
    <SidebarGroup className="bg-white">
      <SidebarGroupLabel className="text-black">Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {item.items ? (
              // Handle collapsible items with subitems
              <details className="group">
                <summary className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer text-black">
                  {item.icon && <item.icon className="h-4 w-4 text-black" />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-black transition-transform group-open:rotate-90" />
                </summary>
                <div className="ml-6 mt-1 space-y-1">
                  {item.items.map((subItem) => (
                    <SidebarMenuButton
                      key={subItem.title}
                      onClick={() => onItemClick && onItemClick(subItem.url)}
                      className="w-full justify-start text-sm text-black hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black active:bg-gray-100 active:text-black data-[active=true]:bg-gray-100 data-[active=true]:text-black"
                    >
                      {subItem.icon && <subItem.icon className="h-4 w-4 text-black" />}
                      <span>{subItem.title}</span>
                    </SidebarMenuButton>
                  ))}
                </div>
              </details>
            ) : (
              // Handle regular menu items
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => onItemClick && onItemClick(item.url)}
                className="text-black hover:bg-gray-100 hover:text-black data-[state=open]:bg-gray-100 data-[state=open]:text-black data-[active=true]:bg-gray-100 data-[active=true]:text-black focus:bg-gray-100 focus:text-black active:bg-gray-100 active:text-black"
              >
                {item.icon && <item.icon className="text-black" />}
                <span className="text-black">{item.title}</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
