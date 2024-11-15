'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useTokenLaunch } from '@/hooks/use-token-launch';

const TokenPreview = dynamic(() => import('@/components/launch/token-preview').then(mod => mod.TokenPreview), { ssr: false });
const SocialLinks = dynamic(() => import('@/components/launch/social-links').then(mod => mod.SocialLinks), { ssr: false });
const ImageUpload = dynamic(() => import('@/components/launch/image-upload').then(mod => mod.ImageUpload), { ssr: false });

const urlSchema = z.string().url('Please enter a valid URL').or(z.literal(''));

const imageUrlPattern = /\.(jpg|jpeg|png|gif|webp)$/i;

const twitterUrlPattern = /^https?:\/\/(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}$/;
const telegramUrlPattern = /^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,}$/;
const discordUrlPattern = /^https?:\/\/discord\.gg\/[a-zA-Z0-9-]+$/;

const formSchema = z.object({
  name: z.string().min(1, 'Token name is required'),
  symbol: z.string().min(1, 'Token symbol is required').max(10),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be at most 500 characters'),
  website: z.string().url('Must be a valid URL'),
  socials: z.object({
    twitter: z.string()
      .refine(val => val === '' || twitterUrlPattern.test(val), {
        message: 'Please enter a valid Twitter/X URL (e.g., https://twitter.com/username or https://x.com/username)'
      }),
    telegram: z.string()
      .refine(val => val === '' || telegramUrlPattern.test(val), {
        message: 'Please enter a valid Telegram URL (e.g., https://t.me/groupname)'
      }),
    discord: z.string()
      .refine(val => val === '' || discordUrlPattern.test(val), {
        message: 'Please enter a valid Discord invite URL (e.g., https://discord.gg/invitecode)'
      }),
  }),
  additionalLinks: z.array(
    z.object({
      name: z.string().min(1, 'Link name is required'),
      url: urlSchema.refine((val) => val !== '', 'URL is required'),
    })
  ).optional(),
  icon: z.string()
    .min(1, 'Token icon is required')
    .url('Must be a valid URL')
    .refine((val) => imageUrlPattern.test(val), {
      message: 'URL must point to a valid image file (jpg, jpeg, png, gif, or webp)'
    }),
  enableFaucet: z.boolean().default(false),
  enableBundleFirstBuy: z.boolean().default(false),
});

export default function LaunchPage() {
  const router = useRouter();
  const { launchToken, isConfirming, isSuccess, walletAddress, isConnected } = useTokenLaunch();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      website: '',
      enableFaucet: false,
      enableBundleFirstBuy: false,
      icon: '',
      socials: {
        twitter: '',
        telegram: '',
        discord: '',
      },
      additionalLinks: [],
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!form.formState.isValid) {
      return;
    }
    try {
      await launchToken(values);
      if (isSuccess) {
        router.push('/tokens');
      }
    } catch (error) {
      console.error('Failed to launch token:', error);
    }
  };

  const isFormValid = form.formState.isValid && !!form.getValues('icon');

  return (
    <div className="grid gap-6 lg:grid-cols-2 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <div className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Basic Information</h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel className={formState.errors.icon ? "text-red-600" : ""}>
                          Token Icon URL*
                        </FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={(url) => {
                              field.onChange(url);
                              form.trigger('icon');
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a URL for your token's icon image. The image should be square and preferably 400x400 pixels or larger.
                        </FormDescription>
                        <FormMessage className={formState.errors.icon ? "text-red-600" : ""} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel className={formState.errors.name ? "text-red-600" : ""}>
                          Token Name*
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className={formState.errors.name ? "text-red-600" : ""} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel className={formState.errors.symbol ? "text-red-600" : ""}>
                          Token Symbol*
                        </FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage className={formState.errors.symbol ? "text-red-600" : ""} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel className={formState.errors.description ? "text-red-600" : ""}>
                          Description*
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage className={formState.errors.description ? "text-red-600" : ""} />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field, formState }) => (
                      <FormItem>
                        <FormLabel className={formState.errors.website ? "text-red-600" : ""}>
                          Website*
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage className={formState.errors.website ? "text-red-600" : ""} />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Social Links</h2>
                <SocialLinks control={form.control} />
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Additional Features</h2>
                <FormField
                  control={form.control}
                  name="enableFaucet"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Faucet</FormLabel>
                        <FormDescription>
                          Allow users to claim tokens from a faucet
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enableBundleFirstBuy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Bundle First Buy</FormLabel>
                        <FormDescription>
                          Allow users to buy a bundle of tokens for their first purchase
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>
          {!isConnected && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to launch a token.
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" size="lg" disabled={isConfirming || !isFormValid || !isConnected}>
            {isConfirming ? 'Launching Token...' : 'Launch Token'}
          </Button>
        </form>
      </Form>
      <div className="space-y-6">
        <div className="sticky top-6 max-w-[425px]">
          <h2 className="mb-4 text-lg font-semibold">Token Explorer Preview</h2>
          <TokenPreview
            name={form.watch('name') || 'Token Name'}
            symbol={form.watch('symbol') || 'SYMBOL'}
            icon={form.watch('icon')}
            description={form.watch('description') || 'Token description...'}
          />
        </div>
      </div>
    </div>
  );
}
