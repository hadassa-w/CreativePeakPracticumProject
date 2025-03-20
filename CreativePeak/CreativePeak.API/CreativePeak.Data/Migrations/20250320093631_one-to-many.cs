using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreativePeak.Data.Migrations
{
    /// <inheritdoc />
    public partial class onetomany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DesignerDetailsId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "DesignersDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Images_CategoryId",
                table: "Images",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Images_DesignerDetailsId",
                table: "Images",
                column: "DesignerDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_DesignersDetails_UserId",
                table: "DesignersDetails",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DesignersDetails_Users_UserId",
                table: "DesignersDetails",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Categories_CategoryId",
                table: "Images",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_DesignersDetails_DesignerDetailsId",
                table: "Images",
                column: "DesignerDetailsId",
                principalTable: "DesignersDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DesignersDetails_Users_UserId",
                table: "DesignersDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Categories_CategoryId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_DesignersDetails_DesignerDetailsId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_CategoryId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Images_DesignerDetailsId",
                table: "Images");

            migrationBuilder.DropIndex(
                name: "IX_DesignersDetails_UserId",
                table: "DesignersDetails");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "DesignerDetailsId",
                table: "Images");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DesignersDetails");
        }
    }
}
