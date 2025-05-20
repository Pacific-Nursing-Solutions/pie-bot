import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const createCompanySchema = z.object({
  name: z.string().min(2, {
    message: 'Company name must be at least 2 characters',
  }),
  entityType: z.string({
    required_error: 'Please select an entity type',
  }),
  authorizedShares: z.coerce.number().int().positive({
    message: 'Authorized shares must be a positive number',
  }),
  valuation: z.coerce.number().int().nonnegative({
    message: 'Valuation must be a non-negative number',
  }).optional(),
});

type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCompanyModal = ({ isOpen, onClose }: CreateCompanyModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      entityType: 'Delaware C Corporation',
      authorizedShares: 10000000,
      valuation: undefined,
    },
  });

  const onSubmit = async (data: CreateCompanyFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/companies', data);
      toast({
        title: "Company created",
        description: `${data.name} has been successfully created`,
      });
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="entityType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Delaware C Corporation">Delaware C Corporation</SelectItem>
                      <SelectItem value="Delaware LLC">Delaware LLC</SelectItem>
                      <SelectItem value="Wyoming LLC">Wyoming LLC</SelectItem>
                      <SelectItem value="Nevada Corporation">Nevada Corporation</SelectItem>
                      <SelectItem value="Other">Other (specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="authorizedShares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Authorized Shares</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Standard is 10,000,000 for venture-backed startups
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="valuation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Valuation (Optional)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">$</span>
                      </div>
                      <Input
                        type="number"
                        className="pl-7"
                        placeholder="e.g. 1000000"
                        {...field}
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Company'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCompanyModal;
