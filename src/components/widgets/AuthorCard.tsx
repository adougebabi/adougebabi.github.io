import { Card } from "@ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import React, { useMemo, lazy } from "react";
import { buttonVariants } from "@ui/button";
import { cn } from "@/lib/utils";

interface LinksProp {
  icon: string;
  to: string;
  label: string;
}

interface AuthorCardProps {
  image: string;
  name: string;
  slug: string;
  description: React.ReactNode;
  links: LinksProp[];
}

const isImageUrl = (str: string): boolean => {
  return /^\/.*\.(png|jpg|jpeg|gif|svg|webp)$/i.test(str);
};

// 将 SimpleIcon 名称转换为 @icons-pack/react-simple-icons 的组件名称
// 注意：iconName 应该已经是符合套件导出格式的 PascalCase，例如 "Github"、"X"、"Linkedin"
const getSimpleIconComponentName = (iconName: string): string => {
  // 直接加上 "Si" 前缀，使用传入的名称，不再尝试变更大小写
  return `Si${iconName}`;
};

const DynamicIcon = ({
  iconName,
  size = 20,
}: {
  iconName: string;
  size?: number;
}) => {
  // 使用 React.lazy 动态导入对应的图标
  const IconComponent = useMemo(() => {
    // 确保 iconName 不是空字符串或 undefined
    if (!iconName || typeof iconName !== 'string') {
      console.warn('Invalid iconName:', iconName);
      return null;
    }

    // 检查是否是图片 URL，如果是则不使用动态导入
    if (isImageUrl(iconName)) {
      return null;
    }

    return lazy(async () => {
      try {
        const mod = await import("@icons-pack/react-simple-icons");
        const componentName = getSimpleIconComponentName(iconName);
        const Icon = mod[componentName as keyof typeof mod];

        if (!Icon) {
          console.warn(`Icon ${componentName} not found in @icons-pack/react-simple-icons, available icons:`, Object.keys(mod).filter(k => k.startsWith('Si')).slice(0, 10));
          throw new Error(`Icon ${componentName} not found`);
        }

        return { default: Icon as React.ComponentType<any> };
      } catch (error) {
        // 找不到图标时的降级处理（例如回传一个预设图标）
        console.warn(`Failed to load icon ${iconName}, using fallback:`, error);
        const mod = await import("lucide-react");
        return {
          default: mod.Earth,
        };
      }
    });
  }, [iconName]);

  // 如果是图片 URL 或无效的 iconName，直接返回 null（由父组件处理）
  if (!iconName || isImageUrl(iconName)) {
    return null;
  }

  if (!IconComponent) {
    return <div style={{ width: size, height: size }} />;
  }

  return (
    <React.Suspense fallback={<div style={{ width: size, height: size }} />}>
      <IconComponent size={size} />
    </React.Suspense>
  );
};

function AuthorCard({
  image,
  name,
  slug,
  description,
  links,
}: AuthorCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gray-800 p-4">
      {/* 裝飾性背景圖 - 右下角 */}
      <div className="pointer-events-none absolute right-0 bottom-0 h-[171px] w-[171px] opacity-40">
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at bottom right, rgba(31,41,55,0) 0%, rgba(31,41,55,1) 68.75%)",
          }}
        />
      </div>

      {/* 卡片內容 */}
      <div className="relative z-10 flex justify-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="w-full space-y-1">
          <h3 className="text-lg font-bold">{name}</h3>
          <h4 className="text-sm font-semibold opacity-30">@{slug}</h4>
          <p className="text-sm">{description}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {links.map((link) => (
              <Tooltip key={link.label}>
                <TooltipTrigger asChild>
                  <a
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                    )}
                  >
                    {isImageUrl(link.icon) ? (
                      <img
                        src={link.icon}
                        alt=""
                        className="h-4.5 w-4.5 object-contain"
                      />
                    ) : link.icon ? (
                      <DynamicIcon iconName={link.icon} size={18} />
                    ) : null}
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AuthorCard;
