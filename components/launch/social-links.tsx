'use client';

import { useState } from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faTelegram, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

interface SocialLinksProps {
  control: Control<any>;
}

export function SocialLinks({ control }: SocialLinksProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalLinks",
  });

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="socials.twitter"
        render={({ field, formState }) => (
          <FormItem>
            <FormLabel className={(formState.errors.socials as any)?.twitter ? "text-red-600" : ""}>
              X / Twitter
            </FormLabel>
            <FormControl>
              <div className="relative">
                <FontAwesomeIcon icon={faXTwitter} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input {...field} className="pl-9" placeholder="https://x.com/username" />
              </div>
            </FormControl>
            <FormMessage className={(formState.errors.socials as any)?.twitter ? "text-red-600" : ""} />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="socials.telegram"
        render={({ field, formState }) => (
          <FormItem>
            <FormLabel className={(formState.errors.socials as any)?.telegram ? "text-red-600" : ""}>
              Telegram
            </FormLabel>
            <FormControl>
              <div className="relative">
                <FontAwesomeIcon icon={faTelegram} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input {...field} className="pl-9" placeholder="https://t.me/groupname" />
              </div>
            </FormControl>
            <FormMessage className={(formState.errors.socials as any)?.telegram ? "text-red-600" : ""} />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="socials.discord"
        render={({ field, formState }) => (
          <FormItem>
            <FormLabel className={(formState.errors.socials as any)?.discord ? "text-red-600" : ""}>
              Discord
            </FormLabel>
            <FormControl>
              <div className="relative">
                <FontAwesomeIcon icon={faDiscord} className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input {...field} className="pl-9" placeholder="https://discord.gg/invitecode" />
              </div>
            </FormControl>
            <FormMessage className={(formState.errors.socials as any)?.discord ? "text-red-600" : ""} />
          </FormItem>
        )}
      />

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2">
          <FormField
            control={control}
            name={`additionalLinks.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Additional Link ${index + 1} Name`}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Link name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`additionalLinks.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Additional Link ${index + 1} URL`}</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input {...field} placeholder="https://" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => append({ name: '', url: '' })}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
        Add Additional Link
      </Button>
    </div>
  );
}
