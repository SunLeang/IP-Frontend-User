"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import ProtectedRoute from "@/components/auth/protected-route"
import { SystemRole } from "@/types/user"
import { apiGet, apiPatch, apiDelete } from "@/services/api"
import { Button } from "@/components/ui/button"
import { User, Edit, Trash2, UserCheck } from "lucide-react"

interface UserData {
  id: string
  email: string
  username?: string
  fullName: string
  systemRole: SystemRole
  currentRole: string
  createdAt: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { hasRole } = useAuth()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiGet("/users")
        setUsers(data)
      } catch (err: any) {
        setError(err.message || "Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: SystemRole) => {
    try {
      await apiPatch(`/users/${userId}/role`, { role: newRole })

      // Update local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, systemRole: newRole } : user)))
    } catch (err: any) {
      setError(err.message || "Failed to update user role")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await apiDelete(`/users/${userId}`)

      // Update local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))
    } catch (err: any) {
      setError(err.message || "Failed to delete user")
    }
  }

  return (
    <ProtectedRoute requiredSystemRole={SystemRole.ADMIN}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">{error}</div>}

        {isLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    System Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.username || "No username"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.systemRole === SystemRole.SUPER_ADMIN
                            ? "bg-purple-100 text-purple-800"
                            : user.systemRole === SystemRole.ADMIN
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.systemRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.currentRole}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Only super admins can change roles to ADMIN or SUPER_ADMIN */}
                        {hasRole(SystemRole.SUPER_ADMIN) && (
                          <div className="relative group">
                            <Button size="sm" variant="outline" className="flex items-center">
                              <UserCheck className="h-4 w-4 mr-1" />
                              Role
                            </Button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                              <button
                                onClick={() => handleRoleChange(user.id, SystemRole.USER)}
                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                  user.systemRole === SystemRole.USER ? "bg-gray-100" : ""
                                }`}
                              >
                                User
                              </button>
                              <button
                                onClick={() => handleRoleChange(user.id, SystemRole.ADMIN)}
                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                  user.systemRole === SystemRole.ADMIN ? "bg-gray-100" : ""
                                }`}
                              >
                                Admin
                              </button>
                              <button
                                onClick={() => handleRoleChange(user.id, SystemRole.SUPER_ADMIN)}
                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${
                                  user.systemRole === SystemRole.SUPER_ADMIN ? "bg-gray-100" : ""
                                }`}
                              >
                                Super Admin
                              </button>
                            </div>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center"
                          onClick={() => (window.location.href = `/users/${user.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex items-center"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
