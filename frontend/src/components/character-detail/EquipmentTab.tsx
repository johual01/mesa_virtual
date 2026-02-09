"use client"

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectOption } from "@/components/ui/select";
import { Package, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Character, EquipmentType, AddItemData, Item, CharacterEquipment, PersonaStadistic } from "@/types/character";
import { characterInventoryService } from "@/services/characterInventoryService";
import { useNotificationContext } from "@/context/notifications";

interface EquipmentTabProps {
  character: Character;
  isOwner: boolean;
  onRefetch?: () => void;
}

const equipmentTypeLabels: Record<EquipmentType, string> = {
  [EquipmentType.WEAPON]: 'Arma',
  [EquipmentType.ARMOR]: 'Armadura',
  [EquipmentType.ACCESORY]: 'Accesorio',
  [EquipmentType.CONSUMIBLE]: 'Consumible',
  [EquipmentType.OTHER]: 'Otro'
};

const proficiencyOptions = [
  { value: 'none', label: 'Ninguno' },
  { value: PersonaStadistic.KNOWLEDGE, label: 'Conocimiento' },
  { value: PersonaStadistic.INSTINCTS, label: 'Instinto' },
  { value: PersonaStadistic.DEXTERITY, label: 'Destreza' },
  { value: PersonaStadistic.COURAGE, label: 'Coraje' },
  { value: PersonaStadistic.CHARISMA, label: 'Carisma' },
];

export function EquipmentTab({ character, isOwner, onRefetch }: EquipmentTabProps) {
  const { error: notifyError, success: notifySuccess } = useNotificationContext();
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CharacterEquipment | null>(null);
  
  // Data states
  const [defaultItems, setDefaultItems] = useState<Item[]>([]);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [isCustomItem, setIsCustomItem] = useState(false);
  const [formData, setFormData] = useState<AddItemData>({
    name: '',
    description: '',
    type: EquipmentType.OTHER,
    category: '',
    equipped: false,
    proficiency: 'none',
    canAttack: false,
    provideDefense: false,
    quantity: 1,
  });

 const loadDefaultItems = useCallback(async () => {
    setIsLoadingDefaults(true);
    try {
      const response = await characterInventoryService.getDefaultItems(character._id);
      setDefaultItems(response.defaultItems);
    } catch {
      notifyError('Error', 'No se pudieron cargar los objetos predeterminados');
    } finally {
      setIsLoadingDefaults(false);
    }
  }, [character._id, notifyError]);

  // Load default items when add modal opens
  useEffect(() => {
    if (showAddModal && defaultItems.length === 0) {
      loadDefaultItems();
    }
  }, [showAddModal, defaultItems.length, loadDefaultItems]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: EquipmentType.OTHER,
      category: '',
      equipped: false,
      proficiency: 'none',
      canAttack: false,
      provideDefense: false,
      quantity: 1,
    });
    setIsCustomItem(false);
  };

  const handleSelectDefaultItem = (itemId: string) => {
    const item = defaultItems.find(i => i._id === itemId);
    if (item) {
      setFormData({
        ...formData,
        name: item.name,
        description: item.description,
        type: item.type,
        category: item.category,
      });
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEdit = (item: CharacterEquipment) => {
    setSelectedItem(item);
    setFormData({
      name: item.equipmentName,
      description: item.description,
      type: item.type,
      category: item.category,
      equipped: item.equipped,
      proficiency: item.proficiency,
      canAttack: item.canAttack,
      provideDefense: item.provideDefense,
      quantity: item.quantity,
      properties: item.properties,
      modifiers: item.modifiers,
      additionalProperties: item.additionalProperties,
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (item: CharacterEquipment) => {
    setSelectedItem(item);
    setShowDeleteAlert(true);
  };

  const handleAddItem = async () => {
    if (!formData.name.trim()) {
      notifyError('Error', 'El nombre del objeto es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      await characterInventoryService.addItem(character._id, formData);
      notifySuccess('Éxito', 'Objeto agregado exitosamente');
      setShowAddModal(false);
      resetForm();
      onRefetch?.();
    } catch {
      notifyError('Error', 'No se pudo agregar el objeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem || !formData.name.trim()) {
      notifyError('Error', 'El nombre del objeto es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      await characterInventoryService.editItem(character._id, selectedItem._id, formData);
      notifySuccess('Éxito', 'Objeto editado exitosamente');
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      onRefetch?.();
    } catch {
      notifyError('Error', 'No se pudo editar el objeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      await characterInventoryService.deleteItem(character._id, selectedItem._id);
      notifySuccess('Éxito', 'Objeto eliminado exitosamente');
      setShowDeleteAlert(false);
      setSelectedItem(null);
      onRefetch?.();
    } catch {
      notifyError('Error', 'No se pudo eliminar el objeto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItemFormFields = () => (
    <div className="space-y-4">
      {/* Select default item or custom */}
      {!isCustomItem && showAddModal && (
        <div className="space-y-2">
          <Label htmlFor="defaultItem">Seleccionar objeto predeterminado</Label>
          <Select 
            id="defaultItem"
            onChange={(e) => handleSelectDefaultItem(e.target.value)}
            disabled={isLoadingDefaults}
          >
            <SelectOption value="">
              {isLoadingDefaults ? 'Cargando...' : 'Seleccione un objeto'}
            </SelectOption>
            {defaultItems.map((item) => (
              <SelectOption key={item._id} value={item._id}>
                {item.name} - {equipmentTypeLabels[item.type]}
              </SelectOption>
            ))}
          </Select>
          <Button 
            type="button" 
            variant="link" 
            size="sm" 
            onClick={() => setIsCustomItem(true)}
            className="px-0"
          >
            O crear objeto personalizado
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nombre del objeto"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descripción del objeto"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select 
            id="type"
            value={formData.type} 
            onChange={(e) => setFormData({ ...formData, type: e.target.value as EquipmentType })}
          >
            {Object.entries(equipmentTypeLabels).map(([value, label]) => (
              <SelectOption key={value} value={value}>
                {label}
              </SelectOption>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Categoría"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Cantidad</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="proficiency">Competencia</Label>
          <Select 
            id="proficiency"
            value={formData.proficiency} 
            onChange={(e) => setFormData({ ...formData, proficiency: e.target.value as PersonaStadistic | 'none' })}
          >
            {proficiencyOptions.map((opt) => (
              <SelectOption key={opt.value} value={opt.value}>
                {opt.label}
              </SelectOption>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="equipped"
            checked={formData.equipped}
            onChange={(e) => setFormData({ ...formData, equipped: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="equipped" className="cursor-pointer">Equipado</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="canAttack"
            checked={formData.canAttack}
            onChange={(e) => setFormData({ ...formData, canAttack: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="canAttack" className="cursor-pointer">Puede atacar</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="provideDefense"
            checked={formData.provideDefense}
            onChange={(e) => setFormData({ ...formData, provideDefense: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="provideDefense" className="cursor-pointer">Proporciona defensa</Label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              EQUIPO E INVENTARIO
            </CardTitle>
            {isOwner && (
              <Button onClick={handleOpenAdd} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Dinero */}
          <div className="flex items-center gap-4 mb-6 p-3 bg-muted/30 rounded-lg">
            <span className="font-semibold">Dinero:</span>
            <span className="text-xl font-bold text-yellow-500">{character.money} ¥</span>
          </div>

          {/* Lista de equipo */}
          {character.characterInventory && character.characterInventory.length > 0 ? (
            <div className="space-y-3">
              {character.characterInventory.map((item) => (
                <div 
                  key={item._id} 
                  className={`p-3 rounded-lg border ${item.equipped ? 'bg-primary/5 border-primary/30' : 'bg-muted/20 border-border'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{item.equipmentName}</h4>
                        {item.equipped && <Badge variant="default" className="text-xs">Equipado</Badge>}
                        <Badge variant="outline" className="text-xs">{equipmentTypeLabels[item.type]}</Badge>
                        {item.category && <Badge variant="secondary" className="text-xs">{item.category}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">Cantidad: x{item.quantity}</span>
                        {item.proficiency !== 'none' && (
                          <span className="text-xs text-muted-foreground">• Competencia: {item.proficiency}</span>
                        )}
                      </div>
                    </div>
                    {isOwner && (
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleOpenDelete(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Este personaje no tiene objetos en su inventario.</p>
              {isOwner && (
                <Button onClick={handleOpenAdd} variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer objeto
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agregar Objeto</DialogTitle>
            <DialogDescription>
              Selecciona un objeto predeterminado o crea uno personalizado.
            </DialogDescription>
          </DialogHeader>
          {renderItemFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleAddItem} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Objeto</DialogTitle>
            <DialogDescription>
              Modifica las propiedades del objeto.
            </DialogDescription>
          </DialogHeader>
          {renderItemFormFields()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleEditItem} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar objeto?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar &quot;{selectedItem?.equipmentName}&quot;? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
