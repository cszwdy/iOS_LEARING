//
//  ViewController.swift
//  imageCompression
//
//  Created by Emiaostein on 6/23/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var imageView: UIImageView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        let imagePath = NSBundle.mainBundle().pathForResource("iOS9", ofType: "jpg")!
        
        let fileManager = NSFileManager.defaultManager()
        let fileAttributes = fileManager.attributesOfItemAtPath(imagePath, error: nil)
        
        let image = UIImage(named: "iOS9.jpg")
        let compressImageData = UIImageJPEGRepresentation(image, 0.01)
        let compressSize = Double(compressImageData.length) / (1024.0 * 1024.0)
        let aimage = UIImage(data: compressImageData)
        imageView.image = aimage
        
        println("compressSize: " + "\(compressSize)")
        
        println(Double(fileAttributes![NSFileSize] as! Int) / (1024.0 * 1024.0))
        
        
    }

    @IBOutlet weak var imagePicker: UIButton!

    @IBAction func ImagePickerAction(sender: UIButton) {
        
        var imagePickerController = UIImagePickerController()
        imagePickerController.delegate = self
        imagePickerController.sourceType = UIImagePickerControllerSourceType.SavedPhotosAlbum
        imagePickerController.allowsEditing = false
        self.presentViewController(imagePickerController, animated: true, completion: { imageP in
            
        })
    }
}

extension ViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [NSObject : AnyObject]) {
        
        let selectedImage = info["UIImagePickerControllerOriginalImage"] as! UIImage
        let originImageData = UIImageJPEGRepresentation(selectedImage, 1)
        let compressImageData = UIImageJPEGRepresentation(selectedImage, 0.01)
        let image = UIImage(data: compressImageData)
        imageView.image = image
        
        println("OriginSize: (\(Double(originImageData.length) / (1024.0 * 1024.0)))")
        println("compressSize: (\(Double(compressImageData.length) / (1024.0 * 1024.0)))")
        
        let vc = UIViewController()
        vc.view.backgroundColor = UIColor.whiteColor()
        
        picker.pushViewController(vc, animated: true)
        
//        picker.dismissViewControllerAnimated(true, completion: nil)
    }
    
}

