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
import { ArrowLeft } from "lucide-react"

interface Domain {
  domainKodifikasiId: number
  namaDomain: string
}

export default function CreateLexiconPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
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
    statusPreservasi: "MAINTAINED",
    status: "DRAFT",
  })

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domain-kodifikasi`)
      const data = await response.json()
      setDomains(data.data || [])
    } catch (error) {
      console.error("Error fetching domains:", error)
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

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lexicons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/lexicon")
      }
    } catch (error) {
      console.error("Error creating lexicon:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/lexicon">
          <Button variant="ghost" size="sm">
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipa">IPA</Label>
                <Input id="ipa" name="ipa" value={formData.ipa} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transliterasi">Transliteration</Label>
                <Input id="transliterasi" name="transliterasi" value={formData.transliterasi} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commonMeaning">Common Meaning</Label>
                <Input id="commonMeaning" name="commonMeaning" value={formData.commonMeaning} onChange={handleChange} />
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Translation</Label>
              <Input id="translation" name="translation" value={formData.translation} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="varian">Variants</Label>
                <Input id="varian" name="varian" value={formData.varian} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="translationVarians">Translation Variants</Label>
                <Input
                  id="translationVarians"
                  name="translationVarians"
                  value={formData.translationVarians}
                  onChange={handleChange}
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
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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
                    {domains.map((domain) => (
                      <SelectItem key={domain.domainKodifikasiId} value={domain.domainKodifikasiId.toString()}>
                        {domain.namaDomain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                    <SelectItem value="ENDANGERED">Endangered</SelectItem>
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
                {loading ? "Creating..." : "Create Lexicon"}
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
