"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Search, Filter, Zap, Settings2, Code2, BookOpen } from "lucide-react"

export default function SearchConfigPage() {
  const [globalSearch, setGlobalSearch] = useState({
    enabled: true,
    maxResults: 20,
    debounceMs: 300,
    highlightResults: true,
  })

  const [lexiconSearch, setLexiconSearch] = useState({
    enabled: true,
    searchFields: ["kataLeksikon", "maknaKultural", "commonMeaning"],
    fuzzyMatching: true,
    minCharacters: 2,
  })

  const [advancedSearch, setAdvancedSearch] = useState({
    enabled: true,
    allowMultipleFilters: true,
    supportedFilters: ["domain", "status", "culture", "subculture"],
  })

  const [subcultureSearch, setSubcultureSearch] = useState({
    enabled: true,
    includeRelatedDomains: true,
    limitResults: 50,
  })

  const [domainSearch, setDomainSearch] = useState({
    enabled: true,
    searchByCode: true,
    searchByName: true,
  })

  const [cultureSearch, setCultureSearch] = useState({
    enabled: true,
    hierarchicalSearch: true,
    includeSubcultures: true,
  })

  const handleSaveGlobalSearch = () => {
    toast.success("Global Search configuration saved")
  }

  const handleSaveLexiconSearch = () => {
    toast.success("Lexicon Search configuration saved")
  }

  const handleSaveAdvancedSearch = () => {
    toast.success("Advanced Search configuration saved")
  }

  const handleSaveSubcultureSearch = () => {
    toast.success("Subculture Search configuration saved")
  }

  const handleSaveDomainSearch = () => {
    toast.success("Domain Search configuration saved")
  }

  const handleSaveCultureSearch = () => {
    toast.success("Culture Search configuration saved")
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Search Configuration</h1>
        <p className="text-muted-foreground mt-1">Manage global search settings and behavior</p>
      </div>

      {/* Global Search Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Global Search</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Global Search</p>
              <p className="text-sm text-muted-foreground">Allow users to search all content</p>
            </div>
            <input
              type="checkbox"
              checked={globalSearch.enabled}
              onChange={(e) => setGlobalSearch({ ...globalSearch, enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div>
            <Label htmlFor="maxResults">Maximum Results</Label>
            <input
              id="maxResults"
              type="number"
              min="5"
              max="100"
              value={globalSearch.maxResults}
              onChange={(e) => setGlobalSearch({ ...globalSearch, maxResults: Number.parseInt(e.target.value) })}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="debounce">Debounce Delay (ms)</Label>
            <input
              id="debounce"
              type="number"
              min="100"
              max="1000"
              step="100"
              value={globalSearch.debounceMs}
              onChange={(e) => setGlobalSearch({ ...globalSearch, debounceMs: Number.parseInt(e.target.value) })}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Highlight Results</p>
              <p className="text-sm text-muted-foreground">Highlight matching text in results</p>
            </div>
            <input
              type="checkbox"
              checked={globalSearch.highlightResults}
              onChange={(e) => setGlobalSearch({ ...globalSearch, highlightResults: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <Button onClick={handleSaveGlobalSearch}>Save Global Search Settings</Button>
        </div>
      </Card>

      {/* Lexicon Search Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Lexicon Search</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Lexicon Search</p>
              <p className="text-sm text-muted-foreground">Search in lexicon fields</p>
            </div>
            <input
              type="checkbox"
              checked={lexiconSearch.enabled}
              onChange={(e) => setLexiconSearch({ ...lexiconSearch, enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div>
            <Label>Search Fields</Label>
            <div className="space-y-2 mt-2">
              {["kataLeksikon", "maknaKultural", "commonMeaning"].map((field) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lexiconSearch.searchFields.includes(field)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLexiconSearch({
                          ...lexiconSearch,
                          searchFields: [...lexiconSearch.searchFields, field],
                        })
                      } else {
                        setLexiconSearch({
                          ...lexiconSearch,
                          searchFields: lexiconSearch.searchFields.filter((f) => f !== field),
                        })
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">{field}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Fuzzy Matching</p>
              <p className="text-sm text-muted-foreground">Enable approximate string matching</p>
            </div>
            <input
              type="checkbox"
              checked={lexiconSearch.fuzzyMatching}
              onChange={(e) => setLexiconSearch({ ...lexiconSearch, fuzzyMatching: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div>
            <Label htmlFor="minChars">Minimum Characters</Label>
            <input
              id="minChars"
              type="number"
              min="1"
              max="5"
              value={lexiconSearch.minCharacters}
              onChange={(e) => setLexiconSearch({ ...lexiconSearch, minCharacters: Number.parseInt(e.target.value) })}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            />
          </div>
          <Button onClick={handleSaveLexiconSearch}>Save Lexicon Search Settings</Button>
        </div>
      </Card>

      {/* Advanced Search Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Advanced Search</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Advanced Search</p>
              <p className="text-sm text-muted-foreground">Allow complex search queries</p>
            </div>
            <input
              type="checkbox"
              checked={advancedSearch.enabled}
              onChange={(e) => setAdvancedSearch({ ...advancedSearch, enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Multiple Filters</p>
              <p className="text-sm text-muted-foreground">Allow combining multiple filters</p>
            </div>
            <input
              type="checkbox"
              checked={advancedSearch.allowMultipleFilters}
              onChange={(e) => setAdvancedSearch({ ...advancedSearch, allowMultipleFilters: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div>
            <Label>Supported Filters</Label>
            <div className="space-y-2 mt-2">
              {["domain", "status", "culture", "subculture"].map((filter) => (
                <div key={filter} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={advancedSearch.supportedFilters.includes(filter)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAdvancedSearch({
                          ...advancedSearch,
                          supportedFilters: [...advancedSearch.supportedFilters, filter],
                        })
                      } else {
                        setAdvancedSearch({
                          ...advancedSearch,
                          supportedFilters: advancedSearch.supportedFilters.filter((f) => f !== filter),
                        })
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <label className="text-sm capitalize">{filter}</label>
                </div>
              ))}
            </div>
          </div>
          <Button onClick={handleSaveAdvancedSearch}>Save Advanced Search Settings</Button>
        </div>
      </Card>

      {/* Subculture Search Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings2 className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Subculture Search</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Subculture Search</p>
              <p className="text-sm text-muted-foreground">Search lexicons within subcultures</p>
            </div>
            <input
              type="checkbox"
              checked={subcultureSearch.enabled}
              onChange={(e) => setSubcultureSearch({ ...subcultureSearch, enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Include Related Domains</p>
              <p className="text-sm text-muted-foreground">Include domain information in results</p>
            </div>
            <input
              type="checkbox"
              checked={subcultureSearch.includeRelatedDomains}
              onChange={(e) => setSubcultureSearch({ ...subcultureSearch, includeRelatedDomains: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div>
            <Label htmlFor="subcultureLimit">Result Limit</Label>
            <input
              id="subcultureLimit"
              type="number"
              min="10"
              max="200"
              value={subcultureSearch.limitResults}
              onChange={(e) =>
                setSubcultureSearch({ ...subcultureSearch, limitResults: Number.parseInt(e.target.value) })
              }
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            />
          </div>
          <Button onClick={handleSaveSubcultureSearch}>Save Subculture Search Settings</Button>
        </div>
      </Card>

      {/* Domain Search Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Domain Search</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Domain Search</p>
              <p className="text-sm text-muted-foreground">Search within specific domains</p>
            </div>
            <input
              type="checkbox"
              checked={domainSearch.enabled}
              onChange={(e) => setDomainSearch({ ...domainSearch, enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Search by Code</p>
              <p className="text-sm text-muted-foreground">Allow searching by domain code</p>
            </div>
            <input
              type="checkbox"
              checked={domainSearch.searchByCode}
              onChange={(e) => setDomainSearch({ ...domainSearch, searchByCode: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Search by Name</p>
              <p className="text-sm text-muted-foreground">Allow searching by domain name</p>
            </div>
            <input
              type="checkbox"
              checked={domainSearch.searchByName}
              onChange={(e) => setDomainSearch({ ...domainSearch, searchByName: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <Button onClick={handleSaveDomainSearch}>Save Domain Search Settings</Button>
        </div>
      </Card>

      {/* Culture Search Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Culture Search</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Culture Search</p>
              <p className="text-sm text-muted-foreground">Search within culture hierarchy</p>
            </div>
            <input
              type="checkbox"
              checked={cultureSearch.enabled}
              onChange={(e) => setCultureSearch({ ...cultureSearch, enabled: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Hierarchical Search</p>
              <p className="text-sm text-muted-foreground">Search across culture hierarchy levels</p>
            </div>
            <input
              type="checkbox"
              checked={cultureSearch.hierarchicalSearch}
              onChange={(e) => setCultureSearch({ ...cultureSearch, hierarchicalSearch: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Include Subcultures</p>
              <p className="text-sm text-muted-foreground">Include subculture results in search</p>
            </div>
            <input
              type="checkbox"
              checked={cultureSearch.includeSubcultures}
              onChange={(e) => setCultureSearch({ ...cultureSearch, includeSubcultures: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
          <Button onClick={handleSaveCultureSearch}>Save Culture Search Settings</Button>
        </div>
      </Card>
    </div>
  )
}
