"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Domain {
  domainKodifikasiId: number
  namaDomain: string
  kode: string
}

interface Contributor {
  contributorId: number
  namaContributor: string
}

export default function CreateLexiconPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kataLeksikon: "",
    ipa: "",
    transliterasi: "",
    maknaEtimologi: "",
    maknaKultural: "",
    commonMeaning: "",
    translation: "",
    varian: "",
    translationVarians: "",
    deskripsiLain: "",
    domainKodifikasiId: "",
    contributorId: "",
    statusPreservasi: "MAINTAINED",
    status: "DRAFT",
  })

  useEffect(() => {
    fetchDomains()
    fetchContributors()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domain-kodifikasi`)
      if (!response.ok) throw new Error("Failed to fetch domains")
      const data = await response.json()
      // Handle both array and object with data property
      setDomains(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching domains:", error)
      toast.error("Failed to load domains")
    }
  }

  const fetchContributors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contributors`)
      if (!response.ok) throw new Error("Failed to fetch contributors")
      const data = await response.json()
      // Handle both array and object with data property
      setContributors(Array.isArray(data) ? data : data.data || [])
    } catch (error) {
      console.error("Error fetching contributors:", error)
      toast.error("Failed to load contributors")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validasi required fields
    if (!formData.kataLeksikon.trim()) {
      toast.error("Kata Leksikon is required")
      setLoading(false)
      return
    }

    if (!formData.domainKodifikasiId) {
      toast.error("Please select a Domain")
      setLoading(false)
      return
    }

    if (!formData.contributorId) {
      toast.error("Please select a Contributor")
      setLoading(false)
      return
    }

    try {
      // Prepare payload - convert string IDs to numbers
      const payload = {
        kataLeksikon: formData.kataLeksikon.trim(),
        ipa: formData.ipa.trim() || "",
        transliterasi: formData.transliterasi.trim() || "",
        maknaEtimologi: formData.maknaEtimologi.trim() || "",
        maknaKultural: formData.maknaKultural.trim() || "",
        commonMeaning: formData.commonMeaning.trim() || "",
        translation: formData.translation.trim() || "",
        varian: formData.varian.trim() || "",
        translationVarians: formData.translationVarians.trim() || "",
        deskripsiLain: formData.deskripsiLain.trim() || "",
        domainKodifikasiId: parseInt(formData.domainKodifikasiId),
        contributorId: parseInt(formData.contributorId),
        statusPreservasi: formData.statusPreservasi,
        status: formData.status,
      }

      console.log("Sending payload:", payload)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leksikons`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error("Error response:", errorData)
        throw new Error(errorData?.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Success response:", result)
      
      toast.success("Lexicon created successfully")
      router.push("/admin/lexicon")
    } catch (error) {
      console.error("Error creating lexicon:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create lexicon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/lexicon">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Lexicon</h1>
          <p className="text-muted-foreground mt-2">Add a new lexicon entry</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lexicon Details</CardTitle>
          <CardDescription>Fill in the lexicon information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kataLeksikon">Lexicon Word *</Label>
                <Input
                  id="kataLeksikon"
                  name="kataLeksikon"
                  value={formData.kataLeksikon}
                  onChange={handleChange}
                  placeholder="e.g., Sego"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipa">IPA</Label>
                <Input 
                  id="ipa" 
                  name="ipa" 
                  value={formData.ipa} 
                  onChange={handleChange}
                  placeholder="e.g., [səˈɡo]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transliterasi">Transliteration</Label>
                <Input
                  id="transliterasi"
                  name="transliterasi"
                  value={formData.transliterasi}
                  onChange={handleChange}
                  placeholder="e.g., sego"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commonMeaning">Common Meaning</Label>
                <Input
                  id="commonMeaning"
                  name="commonMeaning"
                  value={formData.commonMeaning}
                  onChange={handleChange}
                  placeholder="e.g., Rice"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maknaEtimologi">Etymology Meaning</Label>
              <Textarea
                id="maknaEtimologi"
                name="maknaEtimologi"
                value={formData.maknaEtimologi}
                onChange={handleChange}
                rows={3}
                placeholder="Explain the etymology..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maknaKultural">Cultural Meaning</Label>
              <Textarea
                id="maknaKultural"
                name="maknaKultural"
                value={formData.maknaKultural}
                onChange={handleChange}
                rows={3}
                placeholder="Explain the cultural significance..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Translation</Label>
              <Input
                id="translation"
                name="translation"
                value={formData.translation}
                onChange={handleChange}
                placeholder="e.g., Nasi"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="varian">Variants</Label>
                <Input
                  id="varian"
                  name="varian"
                  value={formData.varian}
                  onChange={handleChange}
                  placeholder="e.g., sega, sekul"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="translationVarians">Translation Variants</Label>
                <Input
                  id="translationVarians"
                  name="translationVarians"
                  value={formData.translationVarians}
                  onChange={handleChange}
                  placeholder="e.g., nasi, beras"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsiLain">Additional Description</Label>
              <Textarea
                id="deskripsiLain"
                name="deskripsiLain"
                value={formData.deskripsiLain}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional information..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domainKodifikasiId">Domain *</Label>
                <Select
                  value={formData.domainKodifikasiId}
                  onValueChange={(value) => handleSelectChange("domainKodifikasiId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No domains available</div>
                    ) : (
                      domains.map((domain) => (
                        <SelectItem key={domain.domainKodifikasiId} value={domain.domainKodifikasiId.toString()}>
                          {domain.kode} - {domain.namaDomain}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributorId">Contributor *</Label>
                <Select
                  value={formData.contributorId}
                  onValueChange={(value) => handleSelectChange("contributorId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contributor" />
                  </SelectTrigger>
                  <SelectContent>
                    {contributors.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">No contributors available</div>
                    ) : (
                      contributors.map((contributor) => (
                        <SelectItem key={contributor.contributorId} value={contributor.contributorId.toString()}>
                          {contributor.namaContributor}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="statusPreservasi">Preservation Status</Label>
                <Select
                  value={formData.statusPreservasi}
                  onValueChange={(value) => handleSelectChange("statusPreservasi", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAINTAINED">Maintained</SelectItem>
                    <SelectItem value="ENDANGERED">Endangered</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Lexicon"
                )}
              </Button>
              <Link href="/admin/lexicon">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}