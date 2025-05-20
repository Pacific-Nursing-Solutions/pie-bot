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

const addFounderSchema = z.object({
  name: z.string().min(2, {
    message: 'Founder name must be at least 2 characters',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  role: z.string().min(2, {
    message: 'Role must be at least 2 characters',
  }),
  equityPercentage: z.coerce.number()
    .min(0, { message: 'Percentage must be at least 0' })
    .max(100, { message: 'Percentage must be at most 100' })
    .optional(),
  equityShares: z.coerce.number()
    .nonnegative({ message: 'Shares must be a non-negative number' })
    .optional(),
  vestingSchedule: z.string(),
}).refine(data => data.equityPercentage || data.equityShares, {
  message: "Either equity percentage or number of shares must be provided",
  path: ["equityPercentage"],
});

type AddFounderFormValues = z.infer<typeof addFounderSchema>;

interface AddFounderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFounderModal = ({ isOpen, onClose }: AddFounderModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddFounderFormValues>({
    resolver: zodResolver(addFounderSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      equityPercentage: undefined,
      equityShares: undefined,
      vestingSchedule: 'Standard 4 years with 1 year cliff',
    },
  });

  const onSubmit = async (data: AddFounderFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/stakeholders', {
        ...data,
        type: 'founder',
      });
      toast({
        title: "Founder added",
        description: `${data.name} has been added as a founder`,
      });
      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add founder. Please try again.",
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
          <DialogTitle>Add Founder</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CTO, Head of Product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="equityPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Percentage</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 25" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>Percentage (%)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="equityShares"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equity Shares</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g. 2500000" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>Number of shares</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="vestingSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vesting Schedule</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vesting schedule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Standard 4 years with 1 year cliff">Standard 4 years with 1 year cliff</SelectItem>
                      <SelectItem value="4 years, no cliff">4 years, no cliff</SelectItem>
                      <SelectItem value="3 years with 1 year cliff">3 years with 1 year cliff</SelectItem>
                      <SelectItem value="Custom schedule">Custom schedule</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Founder'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFounderModal;
