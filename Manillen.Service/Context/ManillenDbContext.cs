using Manillen.Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Manillen.Service.Context
{
    public class ManillenDbContext : DbContext
    {
        public ManillenDbContext(DbContextOptions options) : base (options) 
        {

        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("Users");
        }
    }
}
