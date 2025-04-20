import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lead } from "@/types/lead"

interface LeadFormModalProps {
  lead: Lead | null
  open: boolean
  onClose: () => void
  onSave: (updatedLead: LeadUpdatePayload) => Promise<void>
}

interface LeadUpdatePayload {
  type: "updated"
  customerId: string
  data: {
    id: string
    name: string
    websiteUrl: string
    primaryPhone: string
  }
}

export function LeadFormModal({ lead, open, onClose, onSave }: LeadFormModalProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<LeadUpdatePayload>({
    type: "updated",
    customerId: lead?.customerId || "",
    data: {
      id: lead?.leadId || "",
      name: lead?.name || "",
      websiteUrl: "",
      primaryPhone: lead?.primaryPhone || ""
    }
  })

  // Handle mounting for theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Update form data when lead changes
  useEffect(() => {
    if (lead) {
      setFormData({
        type: "updated",
        customerId: lead.customerId,
        data: {
          id: lead.leadId,
          name: lead.name,
          websiteUrl: "",
          primaryPhone: lead.primaryPhone || ""
        }
      })
    }
  }, [lead])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error updating lead:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
      } border rounded-lg shadow-lg sm:max-w-[425px]`}>
        <DialogHeader className="space-y-1 pb-4 border-b">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Edit Lead
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              value={formData.data.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, name: e.target.value }
              }))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="websiteUrl" className="text-sm font-medium">
              Website URL
            </Label>
            <Input
              id="websiteUrl"
              value={formData.data.websiteUrl}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, websiteUrl: e.target.value }
              }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="primaryPhone" className="text-sm font-medium">
              Primary Phone
            </Label>
            <Input
              id="primaryPhone"
              value={formData.data.primaryPhone}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                data: { ...prev.data, primaryPhone: e.target.value }
              }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 