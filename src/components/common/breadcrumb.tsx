"use client"

import React from 'react'
import { usePathname } from 'next/navigation'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from "next/link";

export function PathBreadcrumb() {
    const pathname = usePathname()

    if (pathname === '/dashboard') {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    const segments = pathname.split('/').filter(Boolean)
    const pathItems = segments.reduce((acc, segment, index) => {
        // Skip generating dashboard as a path item (we handle it separately)
        if (segment === 'dashboard' && index === 0) {
            return acc
        }

        const pathSegments = segments.slice(0, index + 1)
        const path = '/' + pathSegments.join('/')
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
        acc.push({ path, label, isLast: index === segments.length - 1 })
        return acc
    }, [] as Array<{ path: string; label: string; isLast: boolean }>)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Dashboard */}
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {/* Generated items */}
                {pathItems.map((item, index) => (
                    <React.Fragment key={item.path}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            {item.isLast ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={item.path}>{item.label}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}