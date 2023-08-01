'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface SettingsFormProps {
  initialdData: Store;
}

const formSchema = z.object({
  name: z.string().min(1),
});

type SettingsFormSchemaValues = z.infer<typeof formSchema>;

const SettingsForm: FC<SettingsFormProps> = ({ initialdData }) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormSchemaValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialdData,
  });

  const onSubmit = async (data: SettingsFormSchemaValues) => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast({
        title: 'Store updated successfully!',
      });
    } catch (error) {
      toast({
        title: 'Something went wrong!',
        description: 'Could not update settings, please try again',
        variant: 'destructive'
      })
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage store preferences' />
        <Button
          variant={'destructive'}
          size='sm'
          disabled={isLoading}
          onClick={() => setOpen(true)}
        >
          <Trash className='h-4 w-4' />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Store name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type='submit'>
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
